import request from '@/utils/request.js'

export const AttributeSearchService =(name)=>{

    return request.get('attribute/query',name)
}

export const AttributeCreateService=(params)=>{
    return request.post('attribute/create',params)

}

export const AttributeUpdateService=(params)=>{

    return request.update('attribute/update',params)
}

export const AttributeDeleteService=(params)=>{
    return request.delete('attribute/delete',params)

}

