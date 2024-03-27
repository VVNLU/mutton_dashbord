export default function useSessionStorage() {
    // 設置
    const setSessionStorage = (key, val) => {
        window.sessionStorage.setItem(key, JSON.stringify(val))
    }
    // 獲取
    const getSessionStorage = (key) => {
        const json = window.sessionStorage.getItem(key)
        return JSON.parse(json)
    }
    // 移除部分
    const removeSessionStorage = (key) => {
        window.sessionStorage.removeItem(key)
    }
    // 移除全部
    const clearSessionStorage = () => {
        window.sessionStorage.clear()
    }

    return {
        setSessionStorage,
        getSessionStorage,
        removeSessionStorage,
        clearSessionStorage,
    }
}