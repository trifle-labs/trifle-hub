<template>
  <!-- typography classes redundantly applied to all breakpoints so they aren't purged and are availabe in parent apps -->
  <h1 class="_h1 sm:_h1 md:_h1 lg:_h1 xl:_h1 2xl:_h1">Heading 1 (._h1)</h1>
  <p class="_bodyText sm:_bodyText md:_bodyText lg:_bodyText xl:_bodyText 2xl:_bodyText">
    Paragraph text (._bodyText) is ideally legible on all devices as is. Maybe a bit larger than web
    default 16px because we cozy goofy. Similar for line-height.
  </p>
  <p
    style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.25; margin-bottom: 1rem"
  >
    Arial, 16px (web default) looks like this which is too small and too cramped.
  </p>
  <p class="_finePrint sm:_finePrint md:_finePrint lg:_finePrint xl:_finePrint 2xl:_finePrint">
    Fineprint (._finePrint) is a bit smaller than base text because it's smol.
  </p>
  <h2 class="_h2 sm:_h2 md:_h2 lg:_h2 xl:_h2 2xl:_h2">Heading 2 (._h2)</h2>
  <p class="_bodyText">Paragraph text is ideally legible on all devices as is</p>
  <h3 class="_h3 sm:_h3 md:_h3 lg:_h3 xl:_h3 2xl:_h3">Heading 3 (._h3)</h3>
  <p class="_bodyText">Paragraph text is ideally legible on all devices as is</p>
  <h4 class="_h4 sm:_h4 md:_h4 lg:_h4 xl:_h4 2xl:_h4">Heading 4 (._h4)</h4>
  <p class="_bodyText">Paragraph text is ideally legible on all devices as is</p>
  <h5 class="_h5 sm:_h5 md:_h5 lg:_h5 xl:_h5 2xl:_h5">Heading 5 (._h5)</h5>
  <p class="_bodyText">Paragraph text is ideally legible on all devices as is</p>
  <h6 class="_h6 sm:_h6 md:_h6 lg:_h6 xl:_h6 2xl:_h6">Heading 6 (._h6)</h6>
  <p class="_bodyText">Paragraph text is ideally legible on all devices as is</p>

  <h2 class="_h1">Font sizes</h2>
  <ul>
    <li class="_text-2xs sm:_text-2xs md:_text-2xs lg:_text-2xs xl:_text-2xs 2xl:_text-2xs">
      ._text-2xs
    </li>
    <li class="_text-xs sm:_text-xs md:_text-xs lg:_text-xs xl:_text-xs 2xl:_text-xs">._text-xs</li>
    <li class="_text-sm sm:_text-sm md:_text-sm lg:_text-sm xl:_text-sm 2xl:_text-sm">._text-sm</li>
    <li class="_text-md sm:_text-md md:_text-md lg:_text-md xl:_text-md 2xl:_text-md">._text-md</li>
    <li class="_text-base sm:_text-base md:_text-base lg:_text-base xl:_text-base 2xl:_text-base">
      ._text-base
    </li>
    <li class="_text-mlg sm:_text-mlg md:_text-mlg lg:_text-mlg xl:_text-mlg 2xl:_text-mlg">
      ._text-mlg
    </li>
    <li class="_text-lg sm:_text-lg md:_text-lg lg:_text-lg xl:_text-lg 2xl:_text-lg">._text-lg</li>
    <li class="_text-xl sm:_text-xl md:_text-xl lg:_text-xl xl:_text-xl 2xl:_text-xl">._text-xl</li>
    <li class="_text-2xl sm:_text-2xl md:_text-2xl lg:_text-2xl xl:_text-2xl 2xl:_text-2xl">
      ._text-2xl
    </li>
    <li class="_text-3xl sm:_text-3xl md:_text-3xl lg:_text-3xl xl:_text-3xl 2xl:_text-3xl">
      ._text-3xl
    </li>
    <li class="_text-4xl sm:_text-4xl md:_text-4xl lg:_text-4xl xl:_text-4xl 2xl:_text-4xl">
      ._text-4xl
    </li>
    <li class="_text-5xl sm:_text-5xl md:_text-5xl lg:_text-5xl xl:_text-5xl 2xl:_text-5xl">
      ._text-5xl
    </li>
    <li class="_text-6xl sm:_text-6xl md:_text-6xl lg:_text-6xl xl:_text-6xl 2xl:_text-6xl">
      ._text-6xl
    </li>
  </ul>

  <h2 class="_h1">Em sizing</h2>
  <p class="_bodyText">
    Em sizing is a relative unit of the font size of the element. It is a percentage of the font
    size of the element.
  </p>
  <ul>
    <li
      class="_text-em-2xs sm:_text-em-2xs md:_text-em-2xs lg:_text-em-2xs xl:_text-em-2xs 2xl:_text-em-2xs"
    >
      ._em-xs will make smaller
    </li>
    <li
      class="_text-em-xs sm:_text-em-xs md:_text-em-xs lg:_text-em-xs xl:_text-em-xs 2xl:_text-em-xs"
    >
      ._em-sm will make smaller
    </li>
    <li
      class="_text-em-sm sm:_text-em-sm md:_text-em-sm lg:_text-em-sm xl:_text-em-sm 2xl:_text-em-sm"
    >
      ._em-md will make <b>bigger</b>
    </li>
    <li
      class="_text-em-lg sm:_text-em-lg md:_text-em-lg lg:_text-em-lg xl:_text-em-lg 2xl:_text-em-lg"
    >
      ._em-lg will make bigger
    </li>
    <li
      class="_text-em-xl sm:_text-em-xl md:_text-em-xl lg:_text-em-xl xl:_text-em-xl 2xl:_text-em-xl"
    >
      ._em-xl will make bigger
    </li>
    <li
      class="_text-em-2xl sm:_text-em-2xl md:_text-em-2xl lg:_text-em-2xl xl:_text-em-2xl 2xl:_text-em-2xl"
    >
      ._em-2xl
    </li>
    <li
      class="_text-em-3xl sm:_text-em-3xl md:_text-em-3xl lg:_text-em-3xl xl:_text-em-3xl 2xl:_text-em-3xl"
    >
      ._em-3xl
    </li>
    <li
      class="_text-em-4xl sm:_text-em-4xl md:_text-em-4xl lg:_text-em-4xl xl:_text-em-4xl 2xl:_text-em-4xl"
    >
      ._em-4xl
    </li>
    <li
      class="_text-em-5xl sm:_text-em-5xl md:_text-em-5xl lg:_text-em-5xl xl:_text-em-5xl 2xl:_text-em-5xl"
    >
      ._em-5xl
    </li>
    <li
      class="_text-em-6xl sm:_text-em-6xl md:_text-em-6xl lg:_text-em-6xl xl:_text-em-6xl 2xl:_text-em-6xl"
    >
      ._em-6xl
    </li>
  </ul>

  <h2 class="_h1">Font weights</h2>
  <ul>
    <li
      class="_text-stroke-xs sm:_text-stroke-xs md:_text-stroke-xs lg:_text-stroke-xs xl:_text-stroke-xs 2xl:_text-stroke-xs"
    >
      ._text-stroke-xs
    </li>
    <li
      class="_text-stroke-sm sm:_text-stroke-sm md:_text-stroke-sm lg:_text-stroke-sm xl:_text-stroke-sm 2xl:_text-stroke-sm"
    >
      ._text-stroke-sm
    </li>
    <li
      class="_text-stroke-md sm:_text-stroke-md md:_text-stroke-md lg:_text-stroke-md xl:_text-stroke-md 2xl:_text-stroke-md"
    >
      ._text-stroke-md
    </li>
    <li
      class="_text-stroke-lg sm:_text-stroke-lg md:_text-stroke-lg lg:_text-stroke-lg xl:_text-stroke-lg 2xl:_text-stroke-lg"
    >
      ._text-stroke-lg
    </li>
    <li
      class="_text-stroke-xl sm:_text-stroke-xl md:_text-stroke-xl lg:_text-stroke-xl xl:_text-stroke-xl 2xl:_text-stroke-xl"
    >
      ._text-stroke-xl
    </li>
    <li
      class="_text-stroke-2xl sm:_text-stroke-2xl md:_text-stroke-2xl lg:_text-stroke-2xl xl:_text-stroke-2xl 2xl:_text-stroke-2xl"
    >
      ._text-stroke-2xl
    </li>
    <li
      class="_text-em-2xs _opacity-50 _mt-2 sm:_text-em-2xs md:_text-em-2xs lg:_text-em-2xs xl:_text-em-2xs 2xl:_text-em-2xs"
    >
      (via text-stroke)
    </li>
    <li class="_semibold sm:_semibold md:_semibold lg:_semibold xl:_semibold 2xl:_semibold">
      ._weight-semibold (._semibold)
    </li>
    <li class="_bold sm:_bold md:_bold lg:_bold xl:_bold 2xl:_bold">._weight-bold (._bold)</li>
    <li
      class="_weight-black sm:_weight-black md:_weight-black lg:_weight-black xl:_weight-black 2xl:_weight-black"
    >
      ._weight-black
    </li>
  </ul>
</template>

<style></style>
