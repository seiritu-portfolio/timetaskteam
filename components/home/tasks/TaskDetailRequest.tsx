import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
// * hooks
import { useCompleteTask } from '@service/taskMutation';
import { useTaskUpdateMutation } from '@service/taskMutation';
import { useTaskDetailForUserList } from '@service/taskQueries';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import { currentTaskSelector } from '@store/selectors/tasks';
import { userInfoSelector } from '@store/selectors/user';
import { guestsSelector, membersSelector } from '@store/selectors/collabos';
// * components
import TaskRequestRow from '../TaskRequestRow';
import TabModalTask from './TabModalTask';
import { MoreMenuForTask } from './MoreMenuForTask';
import { ModalSelOneUser } from '@component/list/ModalSelUserForList';
// * assets
import ArrowDownIcon from '@svg/arrow-down-square.svg';
import { COLOR_VALUES } from '@util/constants';

const RequestManagement = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentTab: (newValue: number) => void;
}) => {
  const currentTask = useSelector(currentTaskSelector);
  const { user } = useSelector(userInfoSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const {
    currentRolePos,
    topCoops,
    midCoops,
    bottomCoops,
    coopIdList,
    cooperatorIDs,
  }: {
    currentRolePos: number;
    topCoops: any[];
    midCoops: any[];
    bottomCoops: any[];
    coopIdList: number[];
    cooperatorIDs: any[];
  } = useMemo(() => {
    if (currentTask) {
      const cooperators = currentTask.cooperators;
      if (cooperators.length === 0) {
        return {
          currentRolePos: 1,
          topCoops: [user],
          midCoops: [],
          bottomCoops: [],
          coopIdList: [user?.id ?? 0],
          cooperatorIDs: [
            {
              [user?.id ?? 0]: 1,
            },
          ],
        };
      }
      const currentRole = currentTask.pivot.role;
      let currentRolePos;
      const coopCollection = cooperators.reduce(
        (
          ctx: {
            [id: string]: any;
          },
          el: any,
        ) => {
          if (el.pivot.role === 1) {
            ctx.top.push(el);
          } else if (el.pivot.role === 2) {
            ctx.mid.push(el);
          } else if (el.pivot.role === 3) {
            ctx.bottom.push(el);
          } else if (el.pivot.role === 4) {
            ctx.bulk.push(el);
          } else {
            ctx.rest.push(el);
          }
          return ctx;
        },
        {
          top: [],
          mid: [],
          bottom: [],
          bulk: [],
          rest: [],
        },
      );
      const midCount = coopCollection.mid.length;
      const bulkCount = coopCollection.bulk.length;

      if (currentRole === 1) {
        currentRolePos = 1;
      } else if (midCount === 0) {
        currentRolePos = bulkCount > 0 ? 4 : 2;
      } else {
        currentRolePos = coopCollection.mid[0].id === user?.id ? 2 : 3;
      }

      const cooperatorIDs = [
        ...coopCollection.top.map((item: any) => ({
          [item.id]: 1,
        })),
        ...coopCollection.mid.map((item: any) => ({
          [item.id]: 2,
        })),
        ...coopCollection.bottom.map((item: any) => ({
          [item.id]: midCount === 0 ? 2 : 3,
        })),
        ...coopCollection.bulk.map((item: any) => ({
          [item.id]: 4,
        })),
      ];

      return {
        currentRolePos,
        topCoops: coopCollection.top,
        midCoops: coopCollection.mid,
        bottomCoops:
          bulkCount > 0 ? coopCollection.bulk : coopCollection.bottom,
        coopIdList: cooperators.map((_: any) => _.id),
        cooperatorIDs,
      };
    } else {
      return {
        currentRolePos: 1,
        topCoops: [user],
        midCoops: [],
        bottomCoops: [],
        coopIdList: [user?.id ?? 0],
        cooperatorIDs: [
          {
            [user?.id ?? 0]: 1,
          },
        ],
      };
    }
  }, [currentTask, user]);

  const tasksForRequestedUsers = useTaskDetailForUserList(
    coopIdList,
    currentTask?.id,
    false,
  );
  const completedStatuses: { [key: number]: boolean } = useMemo(() => {
    const completeStatus: { [key: number]: boolean } = {};
    tasksForRequestedUsers.forEach((result: any) => {
      if (result.isSuccess) {
        completeStatus[result.data?.pivot?.user_id ?? 0] =
          result.data?.pivot?.completed == 1;
      } else if (result.isLoading) {
      }
    });
    return completeStatus;
  }, [tasksForRequestedUsers]);
  const [bottomCompleted, midCompleted, topCompleted]: (boolean | undefined)[] =
    useMemo(() => {
      let bottomCompleted = true;
      if (bottomCoops.length > 0) {
        bottomCoops.forEach((cooperator: any) => {
          if (
            !completedStatuses[cooperator.id] ||
            completedStatuses[cooperator.id] == false
          ) {
            bottomCompleted = false;
          }
        });
      }
      if (!bottomCompleted) {
        return [false, undefined, undefined];
      }
      let midCompleted = true;
      if (midCoops.length > 0) {
        midCoops.forEach((cooperator: any) => {
          if (
            !completedStatuses[cooperator.id] ||
            completedStatuses[cooperator.id] == false
          ) {
            bottomCompleted = false;
          }
        });
      }
      if (!midCompleted) {
        return [true, midCompleted, undefined];
      }
      let topCompleted = true;
      if (topCoops.length > 0) {
        const topId = topCoops[0].id;
        topCompleted =
          completedStatuses[topId] != undefined && completedStatuses[topId];
      }
      return [true, true, topCompleted];
    }, [completedStatuses, topCoops, midCoops, bottomCoops]);

  const completeMutation = useCompleteTask((data) => {});
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    if (currentTask?.pivot?.completed) {
      setCompleted(1);
    }
  }, [currentTask]);
  useEffect(() => {
    if (completeMutation.isSuccess) {
      setCompleted((old) => 1 - old);
    }
  }, [completeMutation.isSuccess]);

  // * request menu functions
  const [addUpdateModal, setAddUpdateModal] = useState(-1); // add 0, update updateUserID
  const { status: updateMutationStatus, mutate: updateMutate } =
    useTaskUpdateMutation(currentTask?.id ?? -1, (_: any) => {});
  const onRequestCancel = useCallback(
    (coopId: number) => {
      const newCooperatorIDs = cooperatorIDs.filter((item) => {
        const currentID = parseInt(Object.keys(item)[0]);

        return currentID !== coopId;
      });

      if (updateMutationStatus !== 'loading') {
        updateMutate({
          ...currentTask,
          cooperator_ids: newCooperatorIDs,
          pivot: undefined,
          cooperators: undefined,
        });
      }
    },
    [cooperatorIDs, currentTask, updateMutationStatus, updateMutate],
  );
  const onRequestUpdate = useCallback(
    (oldCoopId: number, newCoopID: number) => {
      if (updateMutationStatus !== 'loading') {
        const newCooperatorIDs = cooperatorIDs.map((item) => {
          const currentID = parseInt(Object.keys(item)[0]);

          return currentID === oldCoopId
            ? {
                [newCoopID]: item[currentID],
              }
            : item;
        });
        updateMutate({
          ...currentTask,
          cooperator_ids: newCooperatorIDs,
          pivot: undefined,
          cooperators: undefined,
        });
      }
    },
    [cooperatorIDs, currentTask, updateMutationStatus, updateMutate],
  );
  const onRequestAdd = useCallback(
    (newCoopID: number, role: 2 | 3 | 4) => {
      if (updateMutationStatus !== 'loading') {
        const newCooperatorIDs = [
          ...cooperatorIDs,
          {
            [newCoopID]: role,
          },
        ];
        updateMutate({
          ...currentTask,
          cooperator_ids: newCooperatorIDs,
          pivot: undefined,
          cooperators: undefined,
        });
      }
    },
    [cooperatorIDs, currentTask, updateMutationStatus, updateMutate],
  );
  const onRequestAllCancel = useCallback(() => {
    const newCooperatorIDs = cooperatorIDs.filter((item) => {
      const currentID = parseInt(Object.keys(item)[0]);
      return item[currentID] <= currentRolePos;
    });
    updateMutate({
      ...currentTask,
      cooperator_ids: newCooperatorIDs,
      pivot: undefined,
      cooperators: undefined,
    });
  }, [cooperatorIDs, currentRolePos, currentTask, updateMutate]);

  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const colorsDict = useMemo(() => {
    let resultDict: any = {};
    if (members.length > 0) {
      members.forEach((userItem) => {
        resultDict[userItem.id] = userItem.pivot?.color;
      });
    }
    if (guests.length > 0) {
      guests.forEach((userItem) => {
        resultDict[userItem.id] = userItem.pivot?.color;
      });
    }
    if (user) resultDict[user.id] = 4;
    return resultDict;
  }, [members, guests, user]);

  return (
    <div className="py-24px">
      <div className="py-12px rounded-8px bg-backgroundPrimary body2 text-center text-fontSecondary flex-xy-center">
        <span className="w-356px">
          依頼漏れを防ぐ為、依頼主は依頼先のタスク完了を確認後
          完了アクションを実行する必要があります。
          依頼主の完了ボタンは依頼先が完了した時に表示されます。
        </span>
      </div>
      <div className="py-24px border-b border-separator">
        <div
          className={`absolute lds-dual-ring-general z-50 ${
            completeMutation.isLoading ? '' : 'invisible'
          }`}
        />
        {topCoops.map((cooperator: any) => (
          <TaskRequestRow
            id={cooperator.id}
            type={1}
            name={cooperator.name}
            avatar={cooperator.avatar}
            color={COLOR_VALUES[colorsDict[cooperator.id] ?? 4].label}
            key={`cooperator-top-as-requester-${cooperator.id}`}
            showMenu={false}
            selected={topCompleted ? true : false}
            onSelect={() => {
              if (cooperator.id !== user?.id) {
                // ! if not me, I can do nothing to complete this
              } else {
                if (completeMutation.isLoading) {
                } else {
                  completeMutation.mutate({
                    id: currentTask.id ?? 0,
                    completed: 1 - completed,
                  });
                }
              }
            }}
          />
        ))}
        {midCoops.length > 0 ? (
          <>
            <div className="px-12px text-fontSecondary">
              <ArrowDownIcon width={20} height={20} />
            </div>
            {midCoops.map((cooperator: any) => (
              <TaskRequestRow
                id={cooperator.id}
                type={2}
                name={cooperator.name}
                avatar={cooperator.avatar}
                color={COLOR_VALUES[colorsDict[cooperator.id] ?? 4].label}
                key={`cooperator-top-as-requester-${cooperator.id}`}
                hasChild={cooperator.pivot.role === 2 && bottomCoops.length > 0}
                showMenu={currentRolePos <= 2}
                rerequestable={
                  cooperator.id === user?.id && bottomCoops.length == 0
                }
                selected={(() => {
                  if (!bottomCompleted) {
                    return undefined;
                  }
                  if (cooperator.id === user?.id) {
                    return completed == 1;
                  } else {
                    return completedStatuses[cooperator.id] ?? false;
                  }
                })()}
                menuType={
                  cooperator.id === user?.id && bottomCoops.length == 0
                    ? 4
                    : cooperator.id === user?.id && bottomCoops.length > 0
                    ? 1
                    : cooperator.id !== user?.id && currentRolePos === 1
                    ? 2
                    : 0
                }
                onRequestCancel={onRequestCancel}
                onRequestUpdate={onRequestUpdate}
                onRequestAdd={onRequestAdd}
                onRequestAllCancel={onRequestAllCancel}
                onSelect={() => {
                  if (cooperator.id !== user?.id) {
                    // ! if not me, I can do nothing to complete this
                  } else {
                    // ! if me, I can toggle completeness.
                    if (completeMutation.isLoading) {
                    } else {
                      completeMutation.mutate({
                        id: currentTask.id ?? 0,
                        completed: 1 - completed,
                      });
                    }
                  }
                }}
              />
            ))}
          </>
        ) : null}
        {bottomCoops.length > 0 ? (
          <>
            <div className="px-12px text-fontSecondary">
              <ArrowDownIcon width={20} height={20} />
            </div>
            {bottomCoops.map((cooperator: any) => {
              return (
                <TaskRequestRow
                  id={cooperator.id}
                  type={cooperator.pivot?.role ?? 3}
                  name={cooperator.name}
                  avatar={cooperator.avatar}
                  color={COLOR_VALUES[colorsDict[cooperator.id] ?? 4].label}
                  key={`cooperator-top-as-requester-${cooperator.id}`}
                  hasChild={false}
                  showMenu={currentRolePos < 3}
                  rerequestable={false}
                  selected={(() => {
                    if (cooperator.id !== currentCodisplayUserID) {
                      return completedStatuses[cooperator.id] ?? false;
                    }
                    if (cooperator.id === user?.id) {
                      return completed == 1;
                    } else {
                      return completedStatuses[cooperator.id] ?? false;
                    }
                  })()}
                  menuType={
                    cooperator.id === user?.id ? 0 : currentRolePos < 3 ? 2 : 3
                  }
                  onSelect={() => {
                    if (cooperator.id !== user?.id) {
                      // ! if not me, I can do nothing to complete this
                    } else {
                      // ! if me, I can toggle completeness.
                      if (completeMutation.isLoading) {
                      } else {
                        completeMutation.mutate({
                          id: currentTask.id ?? 0,
                          completed: 1 - completed,
                        });
                      }
                    }
                  }}
                  onRequestCancel={onRequestCancel}
                  onRequestUpdate={(newID) => setAddUpdateModal(newID)}
                  onRequestAdd={() => {
                    setAddUpdateModal(0);
                  }}
                  onRequestAllCancel={onRequestAllCancel}
                  // selected={cooperator.id == user?.id ? false : undefined}
                />
              );
            })}
          </>
        ) : null}
      </div>
      <div className="mt-24px flex-row--between">
        <TabModalTask currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <MoreMenuForTask upward={true} />
      </div>
      <ModalSelOneUser
        isOpen={addUpdateModal > -1}
        close={() => {
          setAddUpdateModal(-1);
        }}
        excludedUserIDs={cooperatorIDs.map((item) => {
          const currentID = parseInt(Object.keys(item)[0]);
          return currentID;
        })}
        onConfirm={(idToAdd: number) => {
          if (addUpdateModal === 0) {
            onRequestAdd(idToAdd, currentRolePos === 1 ? 2 : 3);
          } else {
            onRequestUpdate(addUpdateModal, idToAdd);
          }
          setAddUpdateModal(-1);
        }}
      />
    </div>
  );
};

export default RequestManagement;
