import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
import { LightningElement ,track } from 'lwc';

export default class TODO_Manager extends LightningElement {
    @track time ="8.15PM";
    @track greetings="Good Afternoon";
    @track todos = [];

    connectedCallback() {
        //get current time
        this.getTime();
        //this.properties();
        this.fetchTodos();
        setInterval( ()=>{
            this.getTime();
        },1000)
    }
    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;
        this.setGreetings(hour);
    }
    getHour(hour){
        return hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
    }
    getMidDay(hour) {
        return hour >= 12 ? "PM" : "AM";
    }
    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit : digit;
    }
    setGreetings(hour){
        if (hour < 12) {
            this.greetings = "Good Morning";
        } else if (hour >= 12 && hour < 17) {
            this.greetings = "Good Afternoon";
        } else {
            this.greetings = "Good Evening";
        }
    }
    addTodoHandler(){
        const inputBox = this.template.querySelector("lightning-input");
        const todo ={
            todoName : inputBox.value,
            done :false
        }
        addTodo({payload:JSON.stringify(todo)}).then(response =>{
            console.log("Inserted");
            this.fetchTodos();
        }).catch(error=>{
            console.error("Error in Inserting ToDo");
        })
        //this.todos.push(todo); 
        inputBox.value = "";
    }

    get upcomingTask(){
        return this.todos && this.todos.length ? this.todos.filter( todo => !todo.done):[];
    }

    get completedTask(){
        return this.todos && this.todos.length ? this.todos.filter( todo => todo.done):[];
    }
    fetchTodos(){
        getCurrentTodos().then(result=>{
            if(result){
                this.todos = result;
            }
        }).catch(error=>{
            console.error("Error in fetching ToDo");
        });
    }
    updateHandler(){
        this.fetchTodos();
    }
    deleteHandler(){
        this.fetchTodos();
    }
    get largePageSize() {
        return this.flexipageRegionWidth === "SMALL"? "12": this.flexipageRegionWidth === "MEDIUM"? "8": "6";
    }
    /*properties(){
        const todoTest = [
            {
                todoId:0,
                todoName:"tea break",
                done:false,
                date:new Date()
            },
            {
                todoId:1,
                todoName:"lwc learn",
                done:true,
                date:new Date()
            }
        ];
        this.todos=todoTest; 
    }*/
}