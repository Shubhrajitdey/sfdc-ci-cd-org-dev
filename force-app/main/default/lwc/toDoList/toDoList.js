import getAllTodos from '@salesforce/apex/ToDoController.getAllTodos';
import { LightningElement,track, wire } from 'lwc';

export default class ToDoList extends LightningElement {
    @track todos = [];
    @wire(getAllTodos)
    rawToDos({data,error}){
        if(data){
            this.groupToDos(data);
            console.log("fetched");
        }else if(error){
            console.log('Opps! We found some Error while Fetching your data');
        }
    }
    groupToDos(data){
        if(data){
            const toDoWrap = new Map();
            data.forEach(todo => {
                if(!toDoWrap.has(todo.todoDate)){
                    toDoWrap.set(todo.todoDate,[]);
                }
                toDoWrap.get(todo.todoDate).push(todo);
            });
            const toDoDateList =[];
            for(let key of toDoWrap.keys()){
                const finalToDo ={
                    date  : key,
                    items : toDoWrap.get(key)
                };
                toDoDateList.push(finalToDo);
            }
            this.todos = toDoDateList;
        }
    }
}