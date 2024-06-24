import request from '@/utils/request.js'

//part条件查询
export const partListService=(partnumber,partname)=>{
    // let partNumber,partName;
    
    // partNumber=(partnumber==="")?null:partnumber;
    // partName=(partname==="")?null:partname
    const params={
        partNumber: partnumber,
        partName: partname
    }

    return request.post('http://localhost:8080/BOMLink/queryPart',params)
}

//查询该part的子项
export const subPartListService=(versionId)=>{

    return request.post('http://localhost:8080/BOMLink/querySonItem',{versionId})
}


//新增子项
export const AddSubpartService=(addSubPartModel)=>{    
    console.log(addSubPartModel);

    return request.post('/BOMLink/create',addSubPartModel)
}


// 修改子项
export const subPartUpdateService=(subPartModel)=>{//等待参数
    const params = {  
        bomLinkId: subPartModel.bomLinkId,  
        quantity: subPartModel.quantity,
        referenceDesignator: subPartModel.referenceDesignator
      };  

    return request.put('/BOMLink/update',params)//等待路径
}

//删除子项
export const subPartDeleteService=(BOMLinkId)=>{//等待参数id?,具体名字暂时未知
    return request.delete('/BOMLink/delete/id='+BOMLinkId)//等待路径
}//还需要考虑


//查询父项
export const parentListService=(sourceName)=>{

    return request.post('/BOMLink/queryParentItem',{sourceName})
}

//查看bom清单
export const bomListService=(params)=>{

    return request.get(`/BOMLink/listQuery/${params}`)

}

