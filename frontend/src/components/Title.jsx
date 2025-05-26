import React from 'react'

const Title = ({title1, title2, titleStyles, title1Styles, paraStyles}) => {
  return (
    <div className={`${titleStyles} pb-6 text-center`}>
        <h2 className={`${title1Styles} h2 bg-gradient-to-r from-tertiary to-secondary bg-clip-text text-transparent`}>
            {title1}
            <span className='bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent !font-light'> {title2}</span>
        </h2>
        <div className='w-24 h-1 bg-gradient-to-r from-secondaryOne to-sage mx-auto my-4 rounded-full'></div>
        <p className={`${paraStyles} text-gray-50 max-w-2xl mx-auto leading-relaxed`}>
            Dos clássicos atemporais às obras-primas modernas, encontre a 
            leitura perfeita para cada momento
        </p>
    </div>
  )
}

export default Title