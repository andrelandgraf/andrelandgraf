export default function Component() {
  return (
    <div>
      <p>This is a test page (check the console for errors).</p>
      <button
        onClick={() => {
          throw new Error('This is a test error from an onclick event handler');
        }}
      >
        Throw error
      </button>
    </div>
  );
}
