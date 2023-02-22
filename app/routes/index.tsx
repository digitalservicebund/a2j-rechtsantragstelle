import { $path } from "remix-routes";

export default function Index() {
  return (
    <div>
      {/* FIXME: remove empty second parameter after this issue is resolved: https://github.com/yesmeck/remix-routes/issues/43 */}
      <ul>
        <li>
          <a href={$path("/types_showcase", {})}>types showcase</a>
        </li>
        <li>
          <a href={$path("/kitchensink", {})}>kitchensink</a>
        </li>
      </ul>
    </div>
  );
}
