const initDocObj = {
    id: null,
    file_name: '',
    created_at: null,
    has_sales: null,
    has_purchases: null,
    client: {
        last_name: '',
        first_name: '',
        trade_name: '',
        registered_name: '',
    }
}
const initDoc = {
    docArr: [],
    docErr: {
        
    },
    totalDocs: 0,
    docObj: initDocObj,
}

export {
    initDoc
};