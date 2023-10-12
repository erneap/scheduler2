package controllers

import (
	"fmt"
	"net/http"

	"github.com/erneap/go-models/notifications"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/gin-gonic/gin"
)

func GetMessagesForEmployee(c *gin.Context) {
	userid := c.Param("userid")
	logmsg := "NotificationsController: GetMEssageForEmployee:"

	if userid == "" {
		resp := &web.NotificationResponse{
			Exception: "No userid given",
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	msgs, err := svcs.GetMessagesByEmployee(userid)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s GetMessagesByEmployee: %s", logmsg, err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	emp, err := services.GetEmployee(userid)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s GetEmployee: %s", logmsg, err.Error()))
		resp := &web.NotificationResponse{
			Messages:  msgs,
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
	}

	services.AddLogEntry(c, "scheduler", "SUCCESS", "GET",
		fmt.Sprintf("%s Provided notification messages for: %s", logmsg,
			emp.Name.GetLastFirstMI()))
	resp := &web.NotificationResponse{
		Messages:  msgs,
		Exception: "",
	}
	c.JSON(http.StatusOK, resp)
}

func GetMessage(c *gin.Context) {
	messageid := c.Param("id")
	logmsg := "NotificationsController: GetMessage:"

	if messageid == "" {
		resp := &web.NotificationResponse{
			Exception: "No message id given",
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	msgs, err := svcs.GetMessage(messageid)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s GetMessage Problem: %s", logmsg, err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	var messages []notifications.Notification
	messages = append(messages, msgs)
	resp := &web.NotificationResponse{
		Messages:  messages,
		Exception: "",
	}
	services.AddLogEntry(c, "scheduler", "SUCCESS", "GET",
		"Message Retrieved: "+messageid)
	c.JSON(http.StatusOK, resp)
}

func GetAllMessages(c *gin.Context) {
	msgs, err := svcs.GetAllMessages()
	logmsg := "NotificationsController: GetAllMessages:"
	if err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s GetMessages Problem: %s", logmsg, err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	resp := &web.NotificationResponse{
		Messages:  msgs,
		Exception: "",
	}
	services.AddLogEntry(c, "scheduler", "SUCCESS", "GETALL",
		"Provided all messages.")
	c.JSON(http.StatusOK, resp)
}

func CreateMessage(c *gin.Context) {
	var data web.MessageRequest
	logmsg := "NotificationsController: CreateMessage:"

	if err := c.ShouldBindJSON(&data); err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s DataBinding Problem: %s", logmsg, err.Error()))
		c.JSON(http.StatusBadRequest,
			web.NotificationResponse{
				Exception: err.Error(),
			})
		return
	}

	err := svcs.CreateMessage(data.To, data.From, data.Message)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s CreateMessage Problem: %s", logmsg, err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	empTo, _ := services.GetEmployee(data.To)
	empFrom, _ := services.GetEmployee(data.From)

	messages, _ := svcs.GetMessagesByEmployee(data.UserID)
	resp := &web.NotificationResponse{
		Messages:  messages,
		Exception: "",
	}
	if empTo != nil && empFrom != nil {
		services.AddLogEntry(c, "scheduler", "SUCCESS", "CREATED",
			fmt.Sprintf("New Message Provided: TO: %s, FROM: %s, Message: %s",
				empTo.Name.GetLastFirstMI(), empFrom.Name.GetLastFirstMI(), data.Message))
	} else {
		services.AddLogEntry(c, "scheduler", "SUCCESS", "CREATED",
			fmt.Sprintf("New Message Provided: Message: %s", data.Message))
	}
	c.JSON(http.StatusOK, resp)
}

func AcknowledgeMessages(c *gin.Context) {
	var data web.NotificationAck
	logmsg := "NotificationsController: AcknowledgeMessages:"

	if err := c.ShouldBindJSON(&data); err != nil {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s DataBinding Problem: %s", logmsg, err.Error()))
		c.JSON(http.StatusBadRequest,
			web.NotificationResponse{
				Exception: err.Error(),
			})
		return
	}

	exceptions := ""
	userid := ""
	if len(data.Messages) > 0 {
		for m, msg := range data.Messages {
			if userid == "" {
				message, err := svcs.GetMessage(msg)
				if err == nil {
					userid = message.To
				}
			}
			err := svcs.DeleteMessage(msg)
			if err != nil {
				if exceptions != "" {
					exceptions += ";"
				}
				exceptions += fmt.Sprintf("Message %d: %s", m, err.Error())
			}
		}
	}
	if exceptions != "" {
		services.AddLogEntry(c, "scheduler", "Error", "PROBLEM",
			fmt.Sprintf("%s Exceptions Noted: %s", logmsg, exceptions))
		resp := &web.NotificationResponse{
			Exception: exceptions,
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	messages, _ := svcs.GetMessagesByEmployee(userid)
	msgList := ""
	for msg, _ := range data.Messages {
		if msgList != "" {
			msgList += ","
		}
		msgList += fmt.Sprintf("%d", msg)
	}
	if userid != "" {
		emp, _ := services.GetEmployee(userid)
		services.AddLogEntry(c, "scheduler", "SUCCESS", "UPDATE",
			fmt.Sprintf("%s Message Acknowledged: To: %s, Messages: %s", logmsg,
				emp.Name.GetLastFirstMI(), msgList))
	} else {
		services.AddLogEntry(c, "scheduler", "SUCCESS", "UPDATE",
			fmt.Sprintf("%s Message Acknowledged: Messages: %s", logmsg, msgList))
	}
	resp := &web.NotificationResponse{
		Messages:  messages,
		Exception: "",
	}
	c.JSON(http.StatusOK, resp)
}
