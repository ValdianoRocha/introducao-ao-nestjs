import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    //banco de dados fake
    private users = [
    {id:1,name:'joão',email:'joao@gmail.com'},
    {id:2,name:'Maria',email:'maria@gmail.com'}
    ]

   findAllUser():{id:number,name:string,email:string}[]{
    return this.users
   } 

   findIdUser(id:number):{id:number,name:string,email:string} | undefined{
    const user = this.users.find((user)=>user.id===id)
    return user
   }

   createUser(name:string,email:string){
    const newUser = this.users.push({
        id:this.users.length+1,
        name,
        email
    })
    console.log(newUser);
    
    return newUser
   }

   atualizaUsuario(id:number,name:string,email:string){
    const updateUser = this.users.splice(id-1,1,{id,name,email})
    return updateUser
   }

   deletarUsuario(id:number){
    const deleteUser = this.users.splice(id-1,1)
    return deleteUser 
   }
}
