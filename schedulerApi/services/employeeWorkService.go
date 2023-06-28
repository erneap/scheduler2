package services

import (
	"context"

	"github.com/erneap/scheduler/schedulerApi/models/config"
	"github.com/erneap/scheduler/schedulerApi/models/dbdata"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Employee Work is storage records for work accomplished by an employee during
// a single year.
// Every service will have functions for completing the CRUD functions
// the retrieve function will only be for individual employee's year

func CreateEmployeeWork(work *dbdata.EmployeeWorkRecord) error {
	empWCol := config.GetCollection(config.DB, "scheduler", "employeework")

	filter := bson.M{
		"employeeID": work.EmployeeID,
		"year":       work.Year,
	}

	var tEmpWork dbdata.EmployeeWorkRecord

	err := empWCol.FindOne(context.TODO(), filter).Decode(&tEmpWork)
	if err == mongo.ErrNoDocuments {
		work.ID = primitive.NewObjectID()
		_, err = empWCol.InsertOne(context.TODO(), work)
		return err
	} else {
		filter = bson.M{
			"_id": tEmpWork.ID,
		}
		work.ID = tEmpWork.ID
		_, err = empWCol.ReplaceOne(context.TODO(), filter, work)
		return err
	}
}

func GetEmployeeWork(id string, year uint) (*dbdata.EmployeeWorkRecord, error) {
	empWCol := config.GetCollection(config.DB, "scheduler", "employeework")

	empID, _ := primitive.ObjectIDFromHex(id)

	filter := bson.M{
		"employeeID": empID,
		"year":       year,
	}

	var eWork dbdata.EmployeeWorkRecord

	err := empWCol.FindOne(context.TODO(), filter).Decode(&eWork)
	if err != nil {
		return nil, err
	}
	return &eWork, nil
}

func UpdateEmployeeWork(eWork *dbdata.EmployeeWorkRecord) error {
	empWCol := config.GetCollection(config.DB, "scheduler", "employeework")

	filter := bson.M{
		"_id": eWork.ID,
	}

	_, err := empWCol.ReplaceOne(context.TODO(), filter, eWork)
	return err
}

func DeleteEmployeeWork(id string, year uint) error {
	empWCol := config.GetCollection(config.DB, "scheduler", "employeework")

	empID, _ := primitive.ObjectIDFromHex(id)

	filter := bson.M{
		"employeeID": empID,
		"year":       year,
	}

	_, err := empWCol.DeleteOne(context.TODO(), filter)
	return err
}
