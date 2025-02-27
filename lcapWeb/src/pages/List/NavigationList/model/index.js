import { toMobx } from '@chaoswise/cw-mobx';
import { getNavigationTreeApi, getNavigationTableListApi } from '../services';

const model = {
  // 唯一命名空间
  namespace: 'navigationStore',
  // 状态
  state: {
    navigationListData: [], // 导航列表数据
    curPage:1, // 默认页码
    pageSize: 30,// 默认页码size
    total: 10, // 默认总数
    treeData: [], // 树形数据
    departmentKey: "", // 树形节点key值
    searchInfo: {}, // 高级查询参数
    showColumns: ['name', 'department', 'email', 'roles'],// 初始展示的字段
    // 列字段配置总集合
    columns: [
      {
        title: '用户名',
        dataIndex: 'userAlias',
        key: 'userAlias',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 300
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
      }
    ]
  },
  // 副作用actins，处理异步请求 (函数生成器)
  effects: {

    // 获取导航树数据
    *getNavigationTree() {
      const res = yield getNavigationTreeApi();
      if (res && res.data.length > 0) {
        this.treeData = res.data;
        this.departmentKey = res.data[0].key;
        this.onClickSelect([this.departmentKey]);
      }
    },
    // 获取导航列表数据
    *getNavigationTableList(params = {}) {
      // 存储高级查询参数
      const { searchInfo } = params;
      if (searchInfo) {
        this.searchInfo = searchInfo;
      }
      // 处理页码变化
      const { curPage } = params;
      if (curPage) {
        this.curPage = curPage;
      }
      // 请求参数
      let options = {
        departmentKey: this.departmentKey,
        searchInfo: this.searchInfo,
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...params
      };
      // 请求数据
      const res = yield getNavigationTableListApi(options);
      this.navigationListData = res.data;
      this.total = res.total;
    },
  },
  // 状态修改actions
  reducers: {
    // 点击Tree节点,请求数据
    onClickSelect(departmentKey) {
      // 更新树节点和重置页码、高级查询参数
      this.departmentKey = departmentKey[0];
      this.curPage = 1,
        this.searchInfo = {};
      // 请求数据
      this.getNavigationTableList({
        departmentKey: this.departmentKey,
        curPage: this.curPage
      });
    },
    // 处理需要展示的列字段集合
    setShowColumns(selectedColumns) {
      this.showColumns = selectedColumns;
    },
    // 处理表格列总集合字段顺序
    setColumns(dragIndex, hoverIndex) {
      let newColumns = this.columns;
      let temp = newColumns[dragIndex]; //临时储存数据
      newColumns.splice(dragIndex, 1);//移除拖拽项
      newColumns.splice(hoverIndex, 0, temp); //插入放置项
      this.columns = newColumns;
    }
  },
  // 计算属性
  computeds: {
    // 处理表格列展示的计算属性
    getTableColumns() {
      return this.columns.filter(col => this.showColumns.includes(col.dataIndex));
    }
  }
};

export default toMobx(model);