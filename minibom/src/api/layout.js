import request from '@/utils/request.js'

//part条件查询
export const partListService=(partnumber,partname)=>{
    // let partNumber,partName;
    
    // partNumber=(partnumber==="")?null:partnumber;
    // partName=(partname==="")?null:partname
    const params={
        partNumber: (partnumber=="")?null:partnumber,
        partName: (partname=="")?null:partname
    }

    return request.post('/BOMLink/queryPart',params)
}

//查询该part的子项
export const subPartListService=(versionId)=>{
    console.log(versionId);
    return request.post('/BOMLink/querySonItem',{versionId})
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
export const subPartDeleteService=(bomLinkId)=>{
    return request.delete(`/BOMLink/delete/${bomLinkId}`)
}


//查询父项
export const parentListService=(sonItemId)=>{
    console.log(sonItemId);

    return request.post('/BOMLink/queryParentItem',{sonItemId})
}
//查看bom清单
export const bomListService=(params)=>{

    return request.get(`/BOMLink/listQuery/${params}`)

}

//查看版本
export const versionListService=(partId)=>{
    return request.post('/partVersion/query',{partId})

}
