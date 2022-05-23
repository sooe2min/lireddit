import React from 'react'

export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
	variant: WrapperVariant
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
