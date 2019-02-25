// 处理token&&userId
const login = {
    state:{
        userId:null,
        token:null,
    },
    mutations:{
        storeToken(state,data){
            sessionStorage.setItem("token",data);
            this.state.token = data;
        },
        storeUserId(state,data){
            sessionStorage.setItem('userId',data);
            this.state.userId=data;
        },
        logoutDeal(state){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            this.state.token=null;
        },
    },
    actions:{

    }

};
export default login;