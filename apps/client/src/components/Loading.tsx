const Loading = () => {
  return (
    <div className="h-screen w-screen grid place-items-center">
      <div className="relative grid place-items-center">
        <div className="absolute animate-spin animate-pulse rounded-full h-32 w-32 border-t-2 border-b-2 border"></div>
        <div className="absolute animate-pulse">Loading</div>
      </div>
    </div>
  )
}

export default Loading
