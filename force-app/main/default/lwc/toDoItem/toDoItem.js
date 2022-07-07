import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import { LightningElement,api } from 'lwc';

export default class ToDoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done=false;

    get containerClass(){
        return this.done?"todo completed":"todo upcoming";
    }
    get iconName(){
        return this.done?"utility:check":"utility:add";
    }
    updateHandler(){
        const todo ={
            todoId:this.todoId,
            todoName:this.todoName,
            done:!this.done
        }
        updateTodo({payload:JSON.stringify(todo)}).then(result=>{
            const updateEvent = new CustomEvent("update");
            this.dispatchEvent(updateEvent);
        }).catch(error=>{
            console.log("Error in updating");
        });
    }
    deleteHandler(){
        deleteTodo({todoId:this.todoId}).then(result=>{
            const deleteEvent = new CustomEvent("delete");
            this.dispatchEvent(deleteEvent);
        }).catch(error=>{
            console.log("Error in deleting");
        });
    }
}