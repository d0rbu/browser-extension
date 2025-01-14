import { HStack, Spacer, Textarea, useToast, Tag } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { debugMode } from '../constants';
import { useAppState } from '../state/store';
import RunTaskButton from './RunTaskButton';
import TaskHistory from './TaskHistory';
import TaskStatus from './TaskStatus';
import * as Tabs from '@radix-ui/react-tabs';
import Analytics from './Analytics';
import SearchSessions from './SearchSessions';

const TaskUI = () => {
  const state = useAppState((state) => ({
    taskHistory: state.currentTask.history,
    taskStatus: state.currentTask.status,
    runTask: state.currentTask.actions.runTask,
    instructions: state.ui.instructions,
    setInstructions: state.ui.actions.setInstructions,
  }));

  const taskInProgress = state.taskStatus === 'running';

  const toast = useToast();

  const toastError = useCallback(
    (message: string) => {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const runTask = () => {
    state.instructions && state.runTask(toastError);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runTask();
    }
  };

  return (
    <div className="mx-8 grow flex flex-col">
      <Textarea
        autoFocus
        placeholder="Taxy uses OpenAI's GPT-4 API to perform actions on the current page. Try telling it to signup for a newsletter, or to add an item to your cart."
        value={state.instructions || ''}
        disabled={taskInProgress}
        onChange={(e) => state.setInstructions(e.target.value)}
        mb={2}
        onKeyDown={onKeyDown}
      />
      <HStack>
        <RunTaskButton runTask={runTask} />
        <Spacer />
        {debugMode && <TaskStatus />}
      </HStack>
      <Tabs.Root className="grow flex flex-col" defaultValue="tab1">
        <Tabs.List
          className="flex flex-row gap-4"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="py-4 data-[state=active]:border-b data-[state=active]:border-gray-800 font-bold"
            value="tab1"
          >
            Action History
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab2"
            className="py-4 data-[state=active]:border-b data-[state=active]:border-gray-800 font-bold"
          >
            NaviGator 🐊🧭
            <Tag className="ml-1	mt-1" size="sm">
              NEW
            </Tag>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab3"
            className="py-4 data-[state=active]:border-b data-[state=active]:border-gray-800 font-bold"
          >
            Session History 💾
            <Tag className="ml-1	mt-1" size="sm">
              NEW
            </Tag>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="grow flex flex-col" value="tab1">
          <TaskHistory />
        </Tabs.Content>
        <Tabs.Content className="grow flex flex-col" value="tab2">
          <Analytics />
        </Tabs.Content>
        <Tabs.Content className="grow flex flex-col" value="tab3">
          <SearchSessions />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default TaskUI;
