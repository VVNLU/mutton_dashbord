const config = {
    backendHost: '',
    fileServerHost: ''
}

// 代入與替換
export default (name) => {
    if (!(name in config)) {
        return
    }

    const value = config[name]
    if (!value) {
        return
    }

    // 搜尋前綴為 $VITE_APP_ 開頭的 Value 並代入替換 .env 對應的值
    if (value.startsWith('$VITE_')) {
        const envName = value.substr(1)
        const envValue = import.meta.env[envName]

        if (envValue) {
            return envValue
        }
        return ''
    } else {
        return value
    }
}