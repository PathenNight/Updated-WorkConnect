class Activity {
    static idCounter = 1;
  
    constructor(name = "Unnamed Activity", startDate = null, deadline = null) {
      this.id = Activity.idCounter++;
      this.name = name || "Unnamed Activity";
      this.startDate = startDate ? new Date(startDate) : null;
      this.deadline = deadline ? new Date(deadline) : null;
      this.employeeIDs = [];
    }
  
    getName() {
      return this.name;
    }
  
    setName(name) {
      if (name) {
        this.name = name;
      }
    }
  
    getId() {
      return this.id;
    }
  
    getStartDate() {
      return this.startDate;
    }
  
    setStartDate(startDate) {
      this.startDate = startDate ? new Date(startDate) : null;
    }
  
    getDeadline() {
      return this.deadline;
    }
  
    setDeadline(deadline) {
      this.deadline = deadline ? new Date(deadline) : null;
    }
  
    getEmployeeIDs() {
      return this.employeeIDs;
    }
  
    setEmployeeIDs(employeeIDs) {
      this.employeeIDs = Array.isArray(employeeIDs) ? employeeIDs : [];
    }
  
    toString() {
      return `Activity {
        id: ${this.id},
        name: '${this.name}',
        startDate: ${this.startDate ? this.startDate.toISOString().split('T')[0] : 'N/A'},
        deadline: ${this.deadline ? this.deadline.toISOString().split('T')[0] : 'N/A'},
        employeeIDs: ${JSON.stringify(this.employeeIDs)}
      }`;
    }
  }
  
  module.exports = Activity;