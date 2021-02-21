const ReserveStudyService = {
    getAllItems(db) {
      return db
        .from('helsing_reservestudy')
        .select('*')
        .orderBy('date_added', 'asc')
    },
    getReserveStudyById(db, id) {
    return ReserveStudyService.getAllItems(db)
        .where('rs_id', id)
        .first()
    },
    postReserveStudy(db, newStudy) {
      return db
        .insert(newStudy)
        .into('helsing_reservestudy')
        .returning('*')
        .then(([study]) => study)
        .then(study =>
          ReserveStudyService.getById(db, study.rs_id)
        )
    },
    updateReserveStudy(db, id, updatedStudy) {
        return db
          .select('*')
          .from('helsing_reservestudy')
          .where('rs_id', id)
          .update({
              ...updatedStudy
          }, [])
      },
    deleteReserveStudy(db, id) {
        return db
          .select('*')
          .from('helsing_reservestudy')
          .where('rs_id', id)
          .del()
      }
  }
  
  module.exports = ReserveStudyService