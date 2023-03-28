import { MyMap } from "./MyMap"

export class ChatService {
   chatDb = MyMap.get()

   get(key){
      return this.chatDb.map.get(key)
   }

   has(roomId){
      return this.chatDb.map.has(roomId)
   }

   set(key){
       this.chatDb.map.set(key, value)
   }

   keys(){
      return this.chatDb.map.keys()
   }

   forEach(callbackfn){
      return this.chatDb.map.forEach(callbackfn)
   }

   clear(chatDb){
      chatDb.clear()
   }

   delete(key) {
      this.db.map.delete(key)
        
   }
}


export default new RoomService