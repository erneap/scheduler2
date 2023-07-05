package controllers

import (
	"fmt"
	"net/http"

	"github.com/erneap/go-models/logs"
	"github.com/erneap/go-models/notifications"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/gin-gonic/gin"
)

func GetMessagesForEmployee(c *gin.Context) {
	userid := c.Param("userid")

	if userid == "" {
		resp := &web.NotificationResponse{
			Exception: "No userid given",
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	msgs, err := svcs.GetMessagesByEmployee(userid)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"GetMessagesForEmployee: GetMessagesByEmployee: %s", err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug,
		"GetMessagesForEmployee: Provided messages for: "+userid)
	resp := &web.NotificationResponse{
		Messages:  msgs,
		Exception: "",
	}
	c.JSON(http.StatusOK, resp)
}

func GetMessage(c *gin.Context) {
	messageid := c.Param("id")

	if messageid == "" {
		resp := &web.NotificationResponse{
			Exception: "No message id given",
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	msgs, err := svcs.GetMessage(messageid)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"GetMessage: GetMessage Problem: %s", err.Error()))
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
	svcs.AddLogEntry("scheduler", logs.Debug, "GetMessage: Message Retrieved: "+
		messageid)
	c.JSON(http.StatusOK, resp)
}

func GetAllMessages(c *gin.Context) {
	msgs, err := svcs.GetAllMessages()
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"GetAllMessages: GetMessages Problem: %s", err.Error()))
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
	svcs.AddLogEntry("scheduler", logs.Debug, "GetAllMessages: Provided all messages.")
	c.JSON(http.StatusOK, resp)
}

func CreateMessage(c *gin.Context) {
	var data web.MessageRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateMessage: DataBinding Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.NotificationResponse{
				Exception: err.Error(),
			})
		return
	}

	err := svcs.CreateMessage(data.To, data.From, data.Message)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateMessage: CreateMessage Problem: %s", err.Error()))
		resp := &web.NotificationResponse{
			Exception: err.Error(),
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	messages, _ := svcs.GetMessagesByEmployee(data.UserID)
	resp := &web.NotificationResponse{
		Messages:  messages,
		Exception: "",
	}
	svcs.AddLogEntry("scheduler", logs.Debug, "CreateMessage: New Message Provided")
	c.JSON(http.StatusOK, resp)
}

func AcknowledgeMessages(c *gin.Context) {
	var data web.NotificationAck

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"AcknowledgeMessages: DataBinding Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.NotificationResponse{
				Exception: err.Error(),
			})
		return
	}

	exceptions := ""
	if len(data.Messages) > 0 {
		for m, msg := range data.Messages {
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
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"AcknowledgeMessages; Exceptions Noted: %s", exceptions))
		resp := &web.NotificationResponse{
			Exception: exceptions,
		}
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	c.Status(http.StatusOK)
}
