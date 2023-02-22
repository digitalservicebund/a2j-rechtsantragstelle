import { $path } from "remix-routes";

export default function Index() {
  return (
    <div>
      {/* FIXME: remove empty second parameter after this issue is resolved: https://github.com/yesmeck/remix-routes/issues/43 */}
      <a href={$path("/types_showcase", {})}>types showcase</a>
    </div>
  );
}
