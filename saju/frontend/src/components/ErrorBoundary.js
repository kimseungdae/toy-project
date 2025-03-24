import React from 'react';
import ErrorMessage from './common/ErrorMessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          message="예상치 못한 오류가 발생했습니다."
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 