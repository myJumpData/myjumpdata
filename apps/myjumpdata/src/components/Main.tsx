export default function Main(props: any) {
  return (
    <div className="gradient h-full min-h-screen text-white overflow-hidden">
      {props.children}
    </div>
  );
}
