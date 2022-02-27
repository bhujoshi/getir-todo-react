import { DIRTY_ACTION_DELETE, DIRTY_ACTION_UPDATE, API_HOST } from "../contants/common";

const fetchCall = async function(path, method, body){
    return await fetch(`${API_HOST}/${path}`, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body
                }).then((response) => response.json());
}

const saveTodoData = async function(todos) {
    return await Promise.all(todos.map(async (todo)=>{
        const { _id, title, isComplete, isDirty, dirtyAction } = todo;
        let path = null, method = null, body = null, newId = null;
        if (isDirty) {
            if(dirtyAction === DIRTY_ACTION_UPDATE){
                body = JSON.stringify({ title, isComplete });
                if (_id) {
                    path = `todos/item/${_id}`;
                    method = 'PUT';
                } else {
                    path = `todos/item`;
                    method = 'POST';
                }
            }
            if (dirtyAction === DIRTY_ACTION_DELETE) {
                path = `todos/item/${_id}`;
                method = 'DELETE';
            }
            try {
                const res = await fetchCall(path, method, body);
                // setting id of newly saved todo item 
                if(!_id){
                    newId = res.insertedId;
                }
            } catch (error) {
                
            }
        }
        if(newId){
            return {...todo, _id:newId, isDirty: false, dirtyAction: ''};
        }
        return {...todo, isDirty: false, dirtyAction: ''};
    }));
}

export default saveTodoData;