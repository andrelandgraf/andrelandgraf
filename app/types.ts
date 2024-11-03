export type ActionResult<State, ResponseBody> = [status: number, state: State, resData: ResponseBody | undefined];
