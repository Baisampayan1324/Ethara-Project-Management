import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  content: string;
  project: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design UI Mockups', project: 'Website Redesign 2026' },
    'task-2': { id: 'task-2', content: 'Setup Backend Schema', project: 'Website Redesign 2026' },
    'task-3': { id: 'task-3', content: 'Implement Authentication', project: 'Website Redesign 2026' },
    'task-4': { id: 'task-4', content: 'Write Deployment Scripts', project: 'Website Redesign 2026' },
  } as Record<string, Task>,
  columns: {
    'todo': { id: 'todo', title: 'TODO', taskIds: ['task-1', 'task-4'] },
    'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: ['task-3'] },
    'completed': { id: 'completed', title: 'COMPLETED', taskIds: ['task-2'] },
  } as Record<string, Column>,
  columnOrder: ['todo', 'in-progress', 'completed'],
};

const MyTasks = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em] mb-12">My Tasks</h2>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 h-full flex-1 min-h-[500px]">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

            return (
              <div key={column.id} className="flex-1 bg-[#030303] border border-[#27272a] rounded-md p-4 flex flex-col">
                <h3 className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-4 pb-2 border-b border-[#27272a]">
                  {column.title} <span className="ml-2 text-white">{tasks.length}</span>
                </h3>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className="flex-1 min-h-[150px] space-y-3"
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#1a1a1a] border ${snapshot.isDragging ? 'border-white' : 'border-[#27272a]'} p-4 rounded-md shadow-none`}
                            >
                              <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">{task.project}</p>
                              <p className="text-white text-[14px] leading-tight">{task.content}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MyTasks;
