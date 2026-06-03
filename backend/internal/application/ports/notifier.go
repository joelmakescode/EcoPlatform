package ports

type Notifier interface {
	NotifyUserRefresh(userId uint) error
	NotifyUsersRefresh(userIds []uint) error
}
