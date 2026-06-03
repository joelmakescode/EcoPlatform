package logging

import "log/slog"

type SLogAdapter struct {
	logger *slog.Logger
}

func NewSLogAdapter() *SLogAdapter {
	return &SLogAdapter{logger: slog.Default()}
}

func (l *SLogAdapter) Debug(message string, fields ...interface{}) {
	l.logger.Debug(message, fields...)
}

func (l *SLogAdapter) Error(message string, fields ...interface{}) {
	l.logger.Error(message, fields...)
}

func (l *SLogAdapter) Info(message string, fields ...interface{}) {
	l.logger.Info(message, fields...)
}

func (l *SLogAdapter) Warn(message string, fields ...interface{}) {
	l.logger.Warn(message, fields...)
}
