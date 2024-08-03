import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { CEChart } from '@/components/echart';
import { CEditTable } from '@/components/edit-table';
import { CGantt } from '@/components/gantt';
import { ETypeChart } from '@/enums';
import type { IEditTable } from '@/types';
import { formatDataChart } from '@/utils';

import {
  addEdge,
  ConnectionLineType,
  Handle,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import classNames from 'classnames';
import { layoutFromMap } from 'entitree-flex';
import { memo, useCallback } from 'react';

const { Top, Bottom, Left, Right } = Position;

export const CustomNode = memo(({ data, ...props }: any) => {
  const { isSpouse, isSibling, label, direction } = data;

  const isTreeHorizontal = direction === 'LR';

  const getTargetPosition = () => {
    if (isSpouse) {
      return isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      return isTreeHorizontal ? Bottom : Right;
    }
    return isTreeHorizontal ? Left : Top;
  };

  const isRootNode = data?.isRoot;
  const hasChildren = !!data?.children?.length;
  const hasSiblings = !!data?.siblings?.length;
  const hasSpouses = !!data?.spouses?.length;
  console.log(data, props);

  return (
    <div className='nodrag'>
      {/* For children */}
      {hasChildren && (
        <Handle type='source' position={isTreeHorizontal ? Right : Bottom} id={isTreeHorizontal ? Right : Bottom} />
      )}

      {/* For spouses */}
      {hasSpouses && (
        <Handle type='source' position={isTreeHorizontal ? Bottom : Right} id={isTreeHorizontal ? Bottom : Right} />
      )}

      {/* For siblings */}
      {hasSiblings && (
        <Handle type='source' position={isTreeHorizontal ? Top : Left} id={isTreeHorizontal ? Top : Left} />
      )}

      {/* Target Handle */}
      {!isRootNode && <Handle type={'target'} position={getTargetPosition()} id={getTargetPosition()} />}
      <div
        className={classNames(' flex justify-center items-center rounded border', {
          'h-9 min-w-36': !data.data,
          'h-16 min-w-48': data.data,
        })}
      >
        {label}
      </div>
    </div>
  );
});
const nodeTypes: any = {
  custom: CustomNode,
};
export const treeRootId = 1;
export const initialTree = {
  1: {
    id: '1',
    name: 'root',
    type: 'input',
    children: ['2', '3'],
    data: {
      text: 'test 1',
    },
  },
  2: { id: '2', name: 'child2' },
  3: {
    id: '3',
    name: 'child3',
    children: ['4', '5'],
  },
  4: { id: '4', name: 'grandChild4' },
  5: { id: '5', name: 'grandChild5' },
};

const Page = () => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialTree, treeRootId, 'TB');
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    [],
  );
  const onLayout = useCallback(
    direction => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialTree, treeRootId, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );
  return (
    <div className='h-full pb-10'>
      <div className='w-full h-96 relative'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          nodeTypes={nodeTypes}
        >
          <Panel position='top-right'>
            <button onClick={() => onLayout('TB')}>vertical layout</button>
            <button onClick={() => onLayout('LR')}>horizontal layout</button>
          </Panel>
        </ReactFlow>
      </div>

      <h1 className='mb-14 text-center text-3xl font-bold text-primary'>{'Welcome'}</h1>
      {dataDefault.map((item, index) => (
        <CEChart key={index + 'chart'} option={item}></CEChart>
      ))}
      <CGantt data={task} event={event} />
      <CEditTable table={table2} />
      <CEditTable table={table} />
    </div>
  );
};

const Orientation = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
};

const entitreeSettings = {
  clone: true, // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: true, // has slightly better perfomance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 100, // spacing in px between nodes belonging to the same source, eg children with same parent
  nextAfterAccessor: 'spouses', // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 100, // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: 'siblings', // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 100, // the spacing of the "side" nodes BEFORE the current node
  nodeHeight: 35, // default node height in px
  nodeWidth: 150, // default node width in px
  orientation: Orientation.Vertical, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: 0, // set root position if other than 0
  rootY: 0, // set root position if other than 0
  secondDegreeSpacing: 100, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: 'parents', // the prop used as the array of ancestors ids
  sourceTargetSpacing: 100, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: 'children', // the prop used as the array of children ids
};

export const layoutElements = (tree: any, rootId: any, direction = 'TB') => {
  const isTreeHorizontal = direction === 'LR';

  const { nodes: entitreeNodes, rels: entitreeEdges }: any = layoutFromMap(rootId, tree, {
    ...entitreeSettings,
    orientation: isTreeHorizontal ? Orientation.Horizontal : (Orientation.Vertical as any),
  });

  const nodes: any = [],
    edges: any = [];

  entitreeEdges.forEach(edge => {
    const sourceNode = edge.source.id;
    const targetNode = edge.target.id;

    const newEdge: any = {};

    newEdge.id = 'e' + sourceNode + targetNode;
    newEdge.source = sourceNode;
    newEdge.target = targetNode;
    newEdge.type = 'smoothstep';
    newEdge.animated = 'true';

    // Check if target node is spouse or sibling
    const isTargetSpouse = !!edge.target.isSpouse;
    const isTargetSibling = !!edge.target.isSibling;

    if (isTargetSpouse) {
      newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
      newEdge.targetHandle = isTreeHorizontal ? Top : Left;
    } else if (isTargetSibling) {
      newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
      newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
    } else {
      newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
      newEdge.targetHandle = isTreeHorizontal ? Left : Top;
    }

    edges.push(newEdge);
  });

  entitreeNodes.forEach(node => {
    const newNode: any = {};

    const isSpouse = !!node?.isSpouse;
    const isSibling = !!node?.isSibling;
    const isRoot = node?.id === rootId;

    if (isSpouse) {
      newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
      newNode.targetPosition = isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      newNode.sourcePosition = isTreeHorizontal ? Top : Left;
      newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
    } else {
      newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
      newNode.targetPosition = isTreeHorizontal ? Left : Top;
    }

    newNode.data = { label: node.name, direction, isRoot, ...node };
    newNode.id = node.id;
    newNode.type = 'custom';

    newNode.position = {
      x: node.x,
      y: node.y,
    };

    nodes.push(newNode);
  });

  return { nodes, edges };
};

const task = [
  {
    id: '1',
    name: 'Start Project',
    assignee: '',
    status: 'In Progress',
    priority: '',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-07-06'),
    percent: 86,
    level: 0,
    success: '3,5,8',
  },
  {
    id: '2',
    name: 'Demolition',
    assignee: '',
    status: '',
    priority: '',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-07-06'),
    endDate: dayjs('2015-07-15'),
    percent: 86,
    level: 1,
  },
  {
    id: '3',
    name: 'Remove fixtures and cabinets',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-07-06'),
    endDate: dayjs('2015-07-08'),
    percent: 1,
    level: 2,
    success: '4',
  },
  {
    id: '4',
    name: 'Demolish interior walls',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-07-09'),
    endDate: dayjs('2015-07-15'),
    percent: 86,
    level: 2,
    success: '6',
  },
  {
    id: '5',
    name: 'Remove siding',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-07-06'),
    endDate: dayjs('2015-07-07'),
    percent: 50,
    level: 2,
    success: '6',
  },
  {
    id: '6',
    name: 'Demolition complete',
    startDate: dayjs('2015-07-15'),
    level: 2,
  },
  {
    id: '7',
    name: 'Foundation',
    assignee: 'Rose Fuller',
    status: 'On Hold',
    priority: 'Normal',
    planned: 45,
    work: 42,
    startDate: dayjs('2015-07-06'),
    endDate: dayjs('2015-08-07'),
    percent: 72,
    level: 1,
  },
  {
    id: '8',
    name: 'Excavate for foundation',
    assignee: 'Fuller King',
    status: 'Completed',
    priority: 'Critical',
    planned: 32,
    work: 33,
    startDate: dayjs('2015-07-06'),
    endDate: dayjs('2015-07-14'),
    percent: 100,
    level: 2,
    success: '9',
  },
  {
    id: '9',
    name: 'Build foundation',
    assignee: 'Fuller King',
    status: 'Completed',
    priority: 'Critical',
    planned: 32,
    work: 33,
    startDate: dayjs('2015-07-15'),
    endDate: dayjs('2015-07-21'),
    percent: 100,
    level: 2,
    success: '10',
  },
  {
    id: '10',
    name: 'Drying Time',
    assignee: 'Fuller King',
    status: 'Completed',
    priority: 'Critical',
    planned: 32,
    work: 33,
    startDate: dayjs('2015-07-22'),
    endDate: dayjs('2015-08-04'),
    percent: 100,
    level: 2,
    success: '11',
  },
  {
    id: '11',
    name: 'Complete foundation inspection',
    assignee: 'Fuller King',
    status: 'Completed',
    priority: 'Critical',
    planned: 32,
    work: 33,
    startDate: dayjs('2015-08-05'),
    endDate: dayjs('2015-08-05'),
    percent: 100,
    level: 2,
    success: '12',
  },
  {
    id: '12',
    name: 'Backfill foundation',
    assignee: 'Fuller King',
    status: 'Completed',
    priority: 'Critical',
    planned: 32,
    work: 33,
    startDate: dayjs('2015-08-06'),
    endDate: dayjs('2015-08-07'),
    percent: 100,
    level: 2,
    success: '13',
  },
  {
    id: '13',
    name: 'Basics complete',
    startDate: dayjs('2015-08-07'),
    level: 2,
  },
  {
    id: '14',
    name: 'Framing, Walls, Door, and Windows',
    assignee: '',
    status: '',
    priority: '',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-05'),
    endDate: dayjs('2015-08-28'),
    percent: 86,
    level: 1,
  },
  {
    id: '15',
    name: 'Frame roof',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-10'),
    endDate: dayjs('2015-08-14'),
    percent: 1,
    level: 2,
    success: '16',
  },
  {
    id: '16',
    name: 'Close in roof',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-17'),
    endDate: dayjs('2015-08-19'),
    percent: 86,
    level: 2,
    success: '17,24',
  },
  {
    id: '17',
    name: 'Frame interior walls',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-26'),
    percent: 50,
    level: 2,
    success: '18',
  },
  {
    id: '18',
    name: 'Framing complete',
    startDate: dayjs('2015-08-26'),
    level: 2,
    success: '19,20,21',
  },
  {
    id: '19',
    name: 'Hang exterior doors',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-27'),
    endDate: dayjs('2015-08-27'),
    percent: 1,
    level: 2,
    success: '22',
  },
  {
    id: '20',
    name: 'Install windows',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-27'),
    endDate: dayjs('2015-08-31'),
    percent: 86,
    level: 2,
    success: '22',
  },
  {
    id: '21',
    name: 'Install siding',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-27'),
    endDate: dayjs('2015-09-02'),
    percent: 50,
    level: 2,
    success: '22',
  },
  {
    id: '22',
    name: 'Exterior complete',
    startDate: dayjs('2015-09-02'),
    level: 2,
    success: '38',
  },
  {
    id: '23',
    name: 'Interior work',
    assignee: '',
    status: '',
    priority: '',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-19'),
    endDate: dayjs('2015-09-04'),
    percent: 86,
    level: 1,
  },
  {
    id: '24',
    name: 'Interior finish work begins',
    startDate: dayjs('2015-08-19'),
    level: 2,
    success: '38',
  },
  {
    id: '25',
    name: 'Utilities',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-27'),
    percent: 1,
    level: 2,
  },
  {
    id: '26',
    name: 'Rough-in plumbing',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-27'),
    percent: 86,
    level: 3,
    success: '30',
  },
  {
    id: '27',
    name: 'Rough-in electrical',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-26'),
    percent: 50,
    level: 3,
    success: '30',
  },
  {
    id: '28',
    name: 'Rough-in HVAC',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-25'),
    percent: 1,
    level: 3,
    success: '30',
  },
  {
    id: '29',
    name: 'Rough-in communication cabling',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-21'),
    percent: 86,
    level: 3,
    success: '30',
  },
  {
    id: '30',
    name: 'Utilities rough-in complete',
    startDate: dayjs('2015-08-27'),
    level: 2,
    success: '35',
  },
  {
    id: '31',
    name: 'Finish interior walls',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-25'),
    percent: 1,
    level: 2,
  },
  {
    id: '32',
    name: 'Install drywall',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-20'),
    endDate: dayjs('2015-08-24'),
    percent: 86,
    level: 3,
    success: '33',
  },
  {
    id: '33',
    name: 'Paint interior',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-23'),
    endDate: dayjs('2015-08-25'),
    percent: 50,
    level: 3,
    success: '35',
  },

  {
    id: '34',
    name: 'Finish Utilities',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-27'),
    endDate: dayjs('2015-09-04'),
    percent: 1,
    level: 2,
  },
  {
    id: '35',
    name: 'Finish utilities begin',
    startDate: dayjs('2015-08-27'),
    level: 3,
    success: '36,37,38,39',
  },
  {
    id: '36',
    name: 'Complete plumbing',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-28'),
    endDate: dayjs('2015-09-01'),
    percent: 50,
    level: 3,
    success: '40',
  },
  {
    id: '37',
    name: 'Complete electrical wiring',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-08-28'),
    endDate: dayjs('2015-09-03'),
    percent: 1,
    level: 3,
    success: '40',
  },
  {
    id: '38',
    name: 'Complete communication cabling',
    assignee: 'Martin Tamer',
    status: 'Completed',
    priority: 'High',
    planned: 43,
    work: 42,
    startDate: dayjs('2015-09-03'),
    endDate: dayjs('2015-09-04'),
    percent: 86,
    level: 3,
    success: '40',
  },
  {
    id: '39',
    name: 'Complete HVAC',
    assignee: 'Jack Davolio',
    status: 'Completed',
    priority: 'Normal',
    planned: 14,
    work: 18,
    startDate: dayjs('2015-08-28'),
    endDate: dayjs('2015-08-28'),
    percent: 50,
    level: 3,
    success: '40',
  },
  {
    id: '40',
    name: 'Complete Project',
    startDate: dayjs('2015-09-04'),
    level: 3,
  },
];
const event = [
  {
    name: 'New Year holiday',
    startDate: dayjs('2015-07-15'),
    endDate: dayjs('2015-07-16'),
  },
  {
    name: 'Christmas holidays',
    startDate: dayjs('2015-08-15'),
    endDate: dayjs('2015-08-15'),
  },
  {
    name: 'Q-1 Release',
    startDate: dayjs('2015-07-09'),
  },
  // {
  //   name: 'Q-2 Release',
  //   startDate: dayjs('2015-07-30'),
  // },
  // {
  //   name: 'Q-3 Release',
  //   startDate: dayjs('2015-08-10'),
  // },
];

const table: IEditTable = {
  fields: {
    columns: [
      { key: 'content' },
      { key: 'code' },
      {
        key: 'from',
        children: [{ key: 'from2', children: [{ key: 'totalFrom' }, { key: 'numberFrom' }] }],
      },
      {
        key: 'to',
        children: [{ key: 'to2', children: [{ key: 'totalTo' }, { key: 'numberTo' }] }],
      },
      { key: 'note' },
    ],
  },
  meta: [
    {
      field: 'content',
      name: 'Nội dung',
      fullName: 'Nội dung',
      type: 'title',
    },
    {
      field: 'code',
      name: 'Mã số',
      fullName: 'Mã số',
      type: 'title',
    },
    {
      field: 'from',
      name: 'Nơi tới',
      fullName: 'Nơi tới',
      type: 'title',
    },
    {
      field: 'from2',
      name: 'Nơi tới 2',
      fullName: 'Nơi tới 2',
      type: 'title',
    },
    {
      field: 'totalFrom',
      name: 'Tổng số hộ',
      fullName: 'Tổng số hộ tới',
      type: 'number',
    },
    {
      field: 'numberFrom',
      name: 'Số hộ DTTS',
      fullName: 'Số hộ DTTS tới',
      type: 'number',
    },
    {
      field: 'to',
      name: 'Nơi đi',
      fullName: 'Nơi đi',
      type: 'title',
    },
    {
      field: 'to2',
      name: 'Nơi đi 2',
      fullName: 'Nơi đi 2',
      type: 'title',
    },
    {
      field: 'totalTo',
      name: 'Tổng số hộ',
      fullName: 'Tổng số hộ đi',
      type: 'number',
    },
    {
      field: 'numberTo',
      name: 'Số hộ DTTS',
      fullName: 'Số hộ DTTS đi',
      type: 'number',
    },
    {
      field: 'note',
      name: 'Ghi chú',
      fullName: 'Ghi chú',
      type: 'text',
    },
  ],
  data: [
    {
      content: 'Tổng cả tỉnh',
      code: 'xx02',
      totalFrom: 27,
      numberFrom: 35,
      totalTo: 31,
      numberTo: 27,
      note: '',
      order: 1,
      level: 0,
      isSummary: true,
      idBieuNoiDung: 'ab95cabc-2a58-43dc-b664-96c24e35fa97',
      ma: 'B1-BIEU-1_T01_SUMMARY.DISTRICT',
      maCha: 'B1-BIEU-1_T01',
      style: 'font-size:14px; font-weight:bold;',
    },
    {
      content: 'Quận Ba Đình',
      code: 'yy',
      totalFrom: 8,
      numberFrom: 10,
      totalTo: 9,
      numberTo: 8,
      note: '',
      order: 2,
      level: 1,
      isSummary: false,
      idBieuNoiDung: 'ab95cabc-2a58-43dc-b664-96c24e35fa97',
      ma: 'B1-BIEU-1_T01_H001',
      maCha: 'B1-BIEU-1_T01',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo phường xã',
      code: 'yy04',
      totalFrom: 8,
      numberFrom: 10,
      totalTo: 9,
      numberTo: 8,
      note: '',
      order: 3,
      level: 1,
      isSummary: true,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H001_SUMMARY.COMMUNE',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px; font-style:italic;',
    },
    {
      content: 'Phường Phúc Xá',
      code: 'T',
      totalFrom: 5,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 5,
      note: '',
      order: 4,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H001_X00001',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Trúc Bạch',
      code: 'T',
      totalFrom: 1,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 1,
      note: '',
      order: 5,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H001_X00004',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Vĩnh Phúc',
      code: 'T',
      totalFrom: 2,
      numberFrom: 4,
      totalTo: 1,
      numberTo: 2,
      note: '',
      order: 6,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H001_X00006',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo dân tộc',
      code: 'yy05',
      totalFrom: 8,
      numberFrom: 4,
      totalTo: 6,
      numberTo: 8,
      note: '',
      order: 7,
      level: 1,
      isSummary: true,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H001_SUMMARY.ETHNIC',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-style:italic;',
    },
    {
      content: 'Kinh',
      code: '07',
      totalFrom: 4,
      numberFrom: 2,
      totalTo: 3,
      numberTo: 4,
      note: '',
      order: 8,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H001_DT01',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px;',
    },
    {
      content: 'Tày',
      code: 'z',
      totalFrom: 4,
      numberFrom: 2,
      totalTo: 3,
      numberTo: 4,
      note: '',
      order: 9,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H001_DT02',
      maCha: 'B1-BIEU-1_T01_H001',
      style: 'font-size:14px;',
    },
    {
      content: 'Quận Hoàn Kiếm',
      code: 'yy',
      totalFrom: 9,
      numberFrom: 9,
      totalTo: 10,
      numberTo: 9,
      note: '',
      order: 10,
      level: 1,
      idBieuNoiDung: 'ab95cabc-2a58-43dc-b664-96c24e35fa97',
      ma: 'B1-BIEU-1_T01_H002',
      maCha: 'B1-BIEU-1_T01',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo phường xã',
      code: 'yy04',
      totalFrom: 9,
      numberFrom: 9,
      totalTo: 10,
      numberTo: 9,
      note: '',
      order: 11,
      level: 1,
      isSummary: true,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H002_SUMMARY.COMMUNE',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px; font-style:italic;',
    },
    {
      content: 'Phường Phúc Tân',
      code: 'T',
      totalFrom: 4,
      numberFrom: 4,
      totalTo: 7,
      numberTo: 4,
      note: '',
      order: 12,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H002_X00037',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Đồng Xuân',
      code: 'T',
      totalFrom: 2,
      numberFrom: 4,
      totalTo: 1,
      numberTo: 2,
      note: '',
      order: 13,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H002_X00040',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Hàng Ma',
      code: 'T',
      totalFrom: 3,
      numberFrom: 1,
      totalTo: 2,
      numberTo: 3,
      note: '',
      order: 14,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H002_X00043',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo dân tộc',
      code: 'yy05',
      totalFrom: 6,
      numberFrom: 6,
      totalTo: 8,
      numberTo: 6,
      note: '',
      order: 15,
      level: 1,
      isSummary: true,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H002_SUMMARY.ETHNIC',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-style:italic;',
    },
    {
      content: 'Kinh',
      code: '07',
      totalFrom: 5,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 5,
      note: '',
      order: 16,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H002_DT01',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px;',
    },
    {
      content: 'Tày',
      code: 'z',
      totalFrom: 1,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 1,
      note: '',
      order: 17,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H002_DT02',
      maCha: 'B1-BIEU-1_T01_H002',
      style: 'font-size:14px;',
    },
    {
      content: 'Quận Tây Hồ',
      code: 'yy',
      totalFrom: 7,
      numberFrom: 9,
      totalTo: 8,
      numberTo: 7,
      note: '',
      order: 1,
      level: 1,
      isSummary: false,
      idBieuNoiDung: 'ab95cabc-2a58-43dc-b664-96c24e35fa97',
      ma: 'B1-BIEU-1_T01_H003',
      maCha: 'B1-BIEU-1_T01',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo phường xã',
      code: 'yy04',
      totalFrom: 7,
      numberFrom: 9,
      totalTo: 8,
      numberTo: 7,
      note: '',
      order: 3,
      level: 1,
      isSummary: true,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H003_SUMMARY.COMMUNE',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px; font-style:italic;',
    },
    {
      content: 'Phường Phú Thượng',
      code: 'T',
      totalFrom: 4,
      numberFrom: 2,
      totalTo: 3,
      numberTo: 4,
      note: '',
      order: 4,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H003_X00091',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Nhật Tân',
      code: 'T',
      totalFrom: 1,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 1,
      note: '',
      order: 5,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H003_X00094',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Tứ Liên',
      code: 'T',
      totalFrom: 2,
      numberFrom: 4,
      totalTo: 1,
      numberTo: 2,
      note: '',
      order: 6,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H003_X00097',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo dân tộc',
      code: 'yy05',
      totalFrom: 7,
      numberFrom: 3,
      totalTo: 5,
      numberTo: 7,
      note: '',
      order: 7,
      level: 1,
      isSummary: true,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H003_SUMMARY.ETHNIC',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-style:italic;',
    },
    {
      content: 'Kinh',
      code: '07',
      totalFrom: 3,
      numberFrom: 1,
      totalTo: 2,
      numberTo: 3,
      note: '',
      order: 8,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H003_DT01',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px;',
    },
    {
      content: 'Tày',
      code: 'z',
      totalFrom: 4,
      numberFrom: 2,
      totalTo: 3,
      numberTo: 4,
      note: '',
      order: 9,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H003_DT02',
      maCha: 'B1-BIEU-1_T01_H003',
      style: 'font-size:14px;',
    },
    {
      content: 'Quận Long Biên',
      code: 'yy',
      totalFrom: 6,
      numberFrom: 8,
      totalTo: 7,
      numberTo: 6,
      note: '',
      order: 10,
      level: 1,
      isSummary: false,
      idBieuNoiDung: 'ab95cabc-2a58-43dc-b664-96c24e35fa97',
      ma: 'B1-BIEU-1_T01_H004',
      maCha: 'B1-BIEU-1_T01',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo phường xã',
      code: 'yy04',
      totalFrom: 6,
      numberFrom: 8,
      totalTo: 7,
      numberTo: 6,
      note: '',
      order: 11,
      level: 1,
      isSummary: true,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H004_SUMMARY.COMMUNE',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px; font-style:italic;',
    },
    {
      content: 'Phường Thượng Thanh',
      code: 'T',
      totalFrom: 1,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 1,
      note: '',
      order: 12,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H004_X00115',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Ngọc Thụy',
      code: 'T',
      totalFrom: 2,
      numberFrom: 4,
      totalTo: 1,
      numberTo: 2,
      note: '',
      order: 13,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H004_X00118',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px;',
    },
    {
      content: 'Phường Giang Biên',
      code: 'T',
      totalFrom: 3,
      numberFrom: 1,
      totalTo: 2,
      numberTo: 3,
      note: '',
      order: 14,
      level: 2,
      isSummary: false,
      idBieuNoiDung: '19124fdd-7cc4-4ca8-9b99-6ece9f5e8209',
      ma: 'B1-BIEU-1_T01_H004_X00121',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px;',
    },
    {
      content: 'Tổng số phân theo dân tộc',
      code: 'yy05',
      totalFrom: 5,
      numberFrom: 5,
      totalTo: 7,
      numberTo: 5,
      note: '',
      order: 15,
      level: 1,
      isSummary: true,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H004_SUMMARY.ETHNIC',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-style:italic;',
    },
    {
      content: 'Kinh',
      code: '07',
      totalFrom: 4,
      numberFrom: 2,
      totalTo: 3,
      numberTo: 4,
      note: '',
      order: 16,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H004_DT01',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px;',
    },
    {
      content: 'Tày',
      code: 'z',
      totalFrom: 1,
      numberFrom: 3,
      totalTo: 4,
      numberTo: 1,
      note: '',
      order: 17,
      level: 2,
      isSummary: false,
      idBieuNoiDung: 'f7e6c47d-78f9-4aa4-87de-b4fc3c06cc28',
      ma: 'B1-BIEU-1_T01_H004_DT02',
      maCha: 'B1-BIEU-1_T01_H004',
      style: 'font-size:14px;',
    },
  ],
};

const table2: IEditTable = {
  fields: {
    columns: [
      { key: 'data1' },
      { key: 'data2' },
      { key: 'data3' },
      {
        key: 'title1',
        children: [{ key: 'data4' }, { key: 'title2', children: [{ key: 'data5' }, { key: 'data6' }] }],
      },
      {
        key: 'title3',
        children: [{ key: 'data7' }, { key: 'data8' }],
      },
    ],
    rows: ['group1', 'group2'],
  },
  meta: [
    {
      field: 'group1',
      name: 'Cấp học',
      fullName: 'Cấp học',
      type: 'title',
    },
    {
      field: 'group2',
      name: 'Loại hình',
      fullName: 'Loại hình',
      type: 'title',
    },
    {
      field: 'data1',
      name: 'Số trường \n(trường)',
      fullName: 'Số trường',
      type: 'number',
    },
    {
      field: 'data2',
      name: 'Số trường đạt chuẩn \n(trường)',
      fullName: 'Số trường đạt chuẩn',
      type: 'number',
    },
    {
      field: 'data3',
      name: 'Số lớp \n(lớp)',
      fullName: 'Số lớp',
      type: 'number',
    },
    {
      field: 'title1',
      name: 'Số học sinh',
      fullName: 'Số học sinh',
      type: 'title',
    },
    {
      field: 'data4',
      name: 'Tổng số \n(người)',
      fullName: 'Tổng số học sinh',
      type: 'number',
    },
    {
      field: 'title2',
      name: 'Dân tộc thiểu số',
      fullName: 'Dân tộc thiểu số',
      type: 'title',
    },
    {
      field: 'data5',
      name: 'Tổng số \n(người)',
      fullName: 'Tổng số học sinh dân tộc thiểu số',
      type: 'number',
    },
    {
      field: 'data6',
      name: 'Trong đó nữ \n(người)',
      fullName: 'Tổng số học sinh nữ dân tộc thiểu số',
      type: 'number',
    },
    {
      field: 'title3',
      name: 'Số giáo viên',
      fullName: 'Số giáo viên',
      type: 'title',
    },
    {
      field: 'data7',
      name: 'Tổng số \n(người)',
      fullName: 'Tổng số giáo viên',
      type: 'number',
    },
    {
      field: 'data8',
      name: 'Dân tộc thiểu số \n(người)',
      fullName: 'Tổng số giáo viên dân tộc thiểu số',
      type: 'number',
    },
  ],
  data: [
    {
      group1: 'Tiểu học (TH)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 1,
      level: 1,
    },
    {
      group1: 'Tiểu học (TH)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 2,
      level: 1,
    },
    {
      group1: 'Trung học cơ sở (THCS)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 3,
      level: 1,
    },
    {
      group1: 'Trung học cơ sở (THCS)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông cơ sở (liên cấp TH và THCS)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông cơ sở (liên cấp TH và THCS)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trung học phổ thông (THPT)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trung học phổ thông (THPT)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trung học (Liên cấp THCS và THPT)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trung học (Liên cấp THCS và THPT)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trường Phổ thông (Liên cấp TH, THCS sở và THPT)',
      group2: 'Công lập',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Trường Phổ thông (Liên cấp TH, THCS sở và THPT)',
      group2: 'Tư thục',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông DTNT huyện',
      group2: '',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông DTNT tỉnh',
      group2: '',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông DT bán trú',
      group2: 'Tiểu học',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
    {
      group1: 'Phổ thông DT bán trú',
      group2: 'THCS',
      data1: 1,
      data2: 2,
      data3: 3,
      data4: 4,
      data5: 5,
      data6: 6,
      data7: 7,
      data8: 8,
      order: 4,
      level: 1,
    },
  ],
  totals: {
    row: {
      subTotalsDimensions: ['group1'],
      reverseSubLayout: false,
      subLabel: 'Cộng',
    },
  },
};
const dataDefault: any[] = [
  {
    type: ETypeChart.area,
    title: 'Line Chart One',
    series: [
      {
        field: 'totalFrom',
        name: 'Tổng số hộ tới',
        value: [
          [0, 0],
          [1, 1.3488096893269022],
          [2, 0.870353404927271],
          [4, 0.2582374710442245],
          [5, 3.4992630153517794],
          [6, 10.165796338844878],
          [7, 19.435802797730613],
          [8, 29.247221696220688],
          [9, 36.900573657650156],
          [10, 39.941591483707086],
          [11, 37.022903312892616],
          [12, 28.44151963796814],
          [13, 16.152947095922325],
          [14, 3.238238801433192],
          [19, 4.091031098382733],
          [20, 12.759421640647318],
        ],
      },
    ],
  },
  {
    title: 'Ring Chart',
    type: ETypeChart.ringHalfDonut,
    series: [
      {
        data: [{ value: 30, name: 'Tổng số hộ tới', field: 'totalFrom' }],
      },
    ],
    category: ['Quận Ba Đình'],
  },
  formatDataChart({ obj: table, type: ETypeChart.bar, title: 'Bar Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.stackedBar, title: 'Stacked Bar Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.pie, title: 'Pie Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.ring, title: 'Ring Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.line, title: 'Line Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.scatter, title: 'Scatter Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.bubble, title: 'Bubble Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.area, title: 'Area Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.stackedArea, title: 'Stacked Area Chart' }),
  formatDataChart({ obj: table, type: ETypeChart.lineBar, title: 'Line Bar Chart' }),
  {
    type: ETypeChart.line,
    title: 'Line Chart One',
    series: [
      {
        field: 'totalFrom',
        name: 'Tổng số hộ tới',
        value: [
          [0, 0],
          [1, 1.3488096893269022],
          [2, 0.870353404927271],
          [4, 0.2582374710442245],
          [5, 3.4992630153517794],
          [6, 10.165796338844878],
          [7, 19.435802797730613],
          [8, 29.247221696220688],
          [9, 36.900573657650156],
          [10, 39.941591483707086],
          [11, 37.022903312892616],
          [12, 28.44151963796814],
          [13, 16.152947095922325],
          [14, 3.238238801433192],
          [19, 4.091031098382733],
          [20, 12.759421640647318],
        ],
      },
    ],
  },
];

export default Page;
