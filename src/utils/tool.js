import store from '../store/index.js'

export default {
    // 是否有权限
    isPerm(perm){
        if (store.getters.getMenuInfo.perms.indexOf(perm) != -1) return true
        return false
    }
}