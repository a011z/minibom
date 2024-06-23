import request from '@/utils/request.js'

export const VersionService =(partId)=>{

    return request.post('/partVersion/query',partId)
}

//  export default VersionService;