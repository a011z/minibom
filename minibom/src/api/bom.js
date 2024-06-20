import request from '@/utils/request.js'

//bom清单查询
export const bomManageListService =()=>{
    return request.get('/')//获得请求路径及请求方式的接口文档还没收到
}

//新增子项
export const bomManageAddSubpartService=()=>{    
    return request.post('/http://localhost:8080/BOMLink/create')
}

// 修改bom
export const bomManageUpdateService=()=>{//等待参数
    return request.put('/',)//等待路径
}

//删除bom
export const bomManageDeleteService=()=>{//等待参数id?,具体名字暂时未知
    return request.delete('/?id='+id)//等待路径
}