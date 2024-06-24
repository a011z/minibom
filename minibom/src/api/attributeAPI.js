import request from '@/utils/request.js'

export const AttributeSearchService =(params)=>{

    return request.get('attribute/query',{
        params:
        {
            name:params
        }
    }
    )
}

export const AttributeCreateService=(params)=>{
    return request.post('attribute/create',params)

}

export const AttributeUpdateService=(params)=>{

    return request.put('attribute/update',params)
}

export const AttributeDeleteService=(params)=>{
    return request.delete('attribute/delete',
        { data: params }
    )

}

