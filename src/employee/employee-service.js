const EmployeeService = {
    getAllItems(db) {
      return db
        .from('helsing_employee')
        .select('*')
    },
    getEmployeeById(db, id) {
    return EmployeeService.getAllItems(db)
        .where('e_id', id)
        .first()
    },
    postEmployee(db, newEmployee) {
      return db
        .insert(newEmployee)
        .into('helsing_employee')
        .returning('*')
        .then(([employee]) => employee)
        .then(employee =>
          EmployeeService.getById(db, employee.e_id)
        )
    },
    deleteEmployee(db, id) {
        return db
          .select('*')
          .from('helsing_employee')
          .where('e_id', id)
          .del()
      }
  }
  
  module.exports = EmployeeService