import React from 'react'

interface WrapperProps {
	variant: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({
	children,
	variant = 'regular'
}) => {
	return (
		<div
			className={`mt-4 mx-auto w-full ${
				variant === 'regular' ? 'max-w-3xl' : 'max-w-md'
			}`}>
			{children}
		</div>
	)
}
