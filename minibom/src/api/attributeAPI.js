import request from '@/utils/request.js'

export const AttributeSearchService =(name)=>{

    return request.get('attribute/query',name)
}

