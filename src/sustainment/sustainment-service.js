const SustainmentService = {
    getAllItems(db) {
      return db
        .from('helsing_sustainment')
        .select('*')
        .orderBy('date_added', 'asc')
    },
    getSustainmentById(db, id) {
    return SustainmentService.getAllItems(db)
        .where('s_id', id)
        .first()
    },
    postSustainment(db, newStudy) {
      return db
        .insert(newStudy)
        .into('helsing_sustainment')
        .returning('*')
        .then(([study]) => study)
        .then(study =>
          SustainmentService.getSustainmentById(db, study.s_id)
        )
    },
    updateSustainment(db, id, updatedStudy) {
        return db
          .select('*')
          .from('helsing_sustainment')
          .where('s_id', id)
          .update({
              ...updatedStudy
          }, [])
    },
      deleteSustainment(db, id) {
        return db
          .select('*')
          .from('helsing_sustainment')
          .where('s_id', id)
          .del()
      }
  }
  
  module.exports = SustainmentService