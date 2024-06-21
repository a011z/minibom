import request from '@/utils/request.js'

//part条件查询
export const partListService=(partId,partName)=>{
    const params = {  
        partId: partId,  
        partName: partName  
      };  
    return request.post('http://localhost:8080/BOMLink/queryPart',{params})
}

//查询该part的子项
export const subPartListService=(partId)=>{//后端传过来是versionId，还需要重新考虑

    return request.post('http://localhost:8080/BOMLink/querySonItem',{partId})
}


//新增子项
export const AddSubpartService=(partModel)=>{    
    return request.post('/http://localhost:8080/BOMLink/create',partModel)
}


// 修改子项
export const subPartUpdateService=(subPartModel)=>{//等待参数
    const params = {  
        bomLinkId: subPartModel.enCode,  
        quantity: subPartModel.amount,
        referenceDesignator: subPartModel.locationTag
      };  

    return request.put('http://localhost:8080/BOMLink/update}',params)//等待路径
}

//删除子项
export const subPartDeleteService=(BOMLinkId)=>{//等待参数id?,具体名字暂时未知
    return request.delete('http://localhost:8080/BOMLink/delete/id='+id)//等待路径
}//还需要考虑
