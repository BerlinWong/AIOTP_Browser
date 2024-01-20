import axios from 'axios'

export default {
  namespaced: true,
  state: {
    taskList: null
  },
  mutations: {
    kLineList (state, data) {
      state.kLineList = data
    },
    kLineListV2 (state, data) {
      state.kLineListV2 = data
    },
    kLineListV2V2 (state, data) {
      state.kLineListV2V2 = data
    }
  },
  actions: {
    // 封装一个 ajax 方法
    async getSyntheticSiegeIndex (context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/basket/synthetic_siege_index', payload)
      // 提交 mutation 来更新 state
      context.commit('kLineList', response.data)
      return response.data // 可以返回响应数据
    },
    async getSyntheticSiegeIndexV2 (context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/basket/v2/get_basket_index', payload)
      // 提交 mutation 来更新 state
      context.commit('kLineListV2', response.data)
      return response.data // 可以返回响应数据
    },
    async getSyntheticSiegeIndexV2_v2 (context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/basket/v2/get_basket_index_v2', payload)
      // 提交 mutation 来更新 state
      context.commit('kLineListV2V2', response.data)
      return response.data // 可以返回响应数据
    }
  }
}
