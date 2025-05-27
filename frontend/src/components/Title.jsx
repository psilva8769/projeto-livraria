import React from 'react'

const Title = ({ 
    title1, 
    title2, 
    titleStyles = 'pb-1', 
    title1Styles = 'h2', 
    paraStyles = 'hidden',
    para
}) => {
    return (
        <div data-testid="title-container" className={titleStyles}>
            <div className='pb-1'>
                <div data-testid="title-content" className='flex items-center gap-2'>
                    <h2 role="heading" data-testid="title-part1" className={`${title1Styles} inline-block`}>{title1}</h2>
                    <h2 role="heading" data-testid="title-part2" className='text-secondary !font-light inline-block'>{title2}</h2>
                </div>
                <p data-testid="title-paragraph" className={`regular-16 text-gray-30 max-w-[45ch] ${paraStyles}`}>
                    {para || (
                        <>
                            From timeless classics to modern masterpieces,<br />
                            find the perfect read for every moment.
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

export default Title
