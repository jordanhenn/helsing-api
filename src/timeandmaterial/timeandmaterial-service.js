const TimeAndMaterialService = {
    getAllItems(db) {
      return db
        .from('helsing_timeandmaterial')
        .select('*')
        .orderBy('date_added', 'asc')
    },
    getTimeAndMaterialById(db, id) {
    return TimeAndMaterialService.getAllItems(db)
        .where('tm_id', id)
        .first()
    },
    postTimeAndMaterial(db, newStudy) {
      return db
        .insert(newStudy)
        .into('helsing_timeandmaterial')
        .returning('*')
        .then(([study]) => study)
        .then(study =>
          TimeAndMaterialService.getById(db, study.tm_id)
        )
    },
    updateTimeAndMaterial(db, id, updatedStudy) {
        return db
          .select('*')
          .from('helsing_timeandmaterial')
          .where('tm_id', id)
          .update({
              ...updatedStudy
          }, [])
      },
    deleteTimeAndMaterial(db, id) {
          return db
            .select('*')
            .from('helsing_timeandmaterial')
            .where('tm_id', id)
            .del()
        }
  }
  
  module.exports = TimeAndMaterialService