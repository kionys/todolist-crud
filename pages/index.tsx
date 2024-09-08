import { useEffect, useState } from "react";

const initializeData = [
  { id: 1, content: "아침에 루루 간식주기", isCheck: false, isEdit: false },
  {
    id: 2,
    content: "출근 전 음식물쓰레기 버리기",
    isCheck: false,
    isEdit: false,
  },
  {
    id: 3,
    content: "오후 4시 갈산역 중고거래: USB 메모리",
    isCheck: false,
    isEdit: false,
  },
];
interface IStateTodo {
  id: number;
  content: string;
  isCheck: boolean;
  isEdit: boolean;
}
export default function Home() {
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [todoList, setTodoList] = useState<IStateTodo[]>(initializeData);
  const [filterdTodoList, setFilterdTodoList] = useState<IStateTodo[]>([]);
  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState({ content: "" });

  // 검색
  useEffect(() => {
    const filteredList = [...todoList].filter(item => {
      return item.content.includes(filter.content);
    });
    setFilterdTodoList(filteredList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.content]);

  // 탭 변경
  const onClickTab = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.id === "todo" && setTab("todo");
    e.currentTarget.id === "done" && setTab("done");
  };

  // 할 일 완료
  const onChangeCheckbox = (id: number, isEdit: boolean) => {
    // 편집중일땐 리턴
    if (isEdit) return;

    // 필터중일때
    if (filter.content) {
      const checkedList = filterdTodoList.map(item => {
        return item.id === id ? { ...item, isCheck: !item.isCheck } : item;
      });
      setFilterdTodoList(checkedList);
      return;
    }

    const checkedList = todoList.map(item => {
      return item.id === id ? { ...item, isCheck: !item.isCheck } : item;
    });
    setTodoList(checkedList);
  };

  // 할 일 추가
  const onClickAddTodo = () => {
    const deepCopy = [...todoList];
    const id = deepCopy.length > 0 ? deepCopy[deepCopy.length - 1].id + 1 : 1;

    const newTodo = [
      ...todoList,
      {
        id: id,
        content: input,
        isCheck: false,
        isEdit: false,
      },
    ];
    setTodoList(newTodo);
    setInput("");
  };

  // 할 일 추가(엔터)
  const onKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClickAddTodo();
    }
  };

  // 할 일 삭제
  const onClickDeleteTodo = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.stopPropagation();
    const deletedList = [...todoList].filter(item => {
      return item.id !== id;
    });
    setTodoList(deletedList);
  };

  // 편집 상태로 변경
  const onClickIsEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.stopPropagation();

    // 필터중일때
    if (filter.content) {
      const isEditingList = [...filterdTodoList].map(item => {
        return item.id === id ? { ...item, isEdit: !item.isEdit } : item;
      });
      setFilterdTodoList(isEditingList);
      return;
    }

    const isEditingList = [...todoList].map(item => {
      return item.id === id ? { ...item, isEdit: !item.isEdit } : item;
    });
    setTodoList(isEditingList);
  };
  return (
    <>
      {/* Container Wrap */}
      <div className="flex px-5 py-5 flex-col gap-3">
        {/* Sticky Wrap */}
        <div className="sticky top-0 left-0 right-0 z-10 flex flex-col gap-3 bg-white py-5">
          {/* Tab Wrap */}
          <div className="flex gap-3 items-center text-lg">
            {/* Tab */}
            <div
              className={`${
                tab === "todo"
                  ? "font-bold text-black"
                  : "font-bold text-gray-400"
              } cursor-pointer`}
              id="todo"
              onClick={onClickTab}
            >
              할 일
            </div>
            {/* <div
              className={`${
                tab === "done"
                  ? "font-bold text-black"
                  : "font-bold text-gray-400"
              } cursor-pointer`}
              id="done"
              onClick={onClickTab}
            >
              완료됨
            </div> */}
          </div>

          {/* Search Bar */}
          <input
            type="text"
            className="border-gray-300 border rounded-full p-3 bg-gray-50"
            placeholder="검색"
            onChange={e => setFilter({ ...filter, content: e.target.value })}
            value={filter.content}
          />
        </div>

        {/* Content */}
        {todoList && todoList.length > 0 && filter.content === "" ? (
          todoList.map((todo: IStateTodo, i: number) => {
            return (
              <div
                key={i}
                className="flex flex-grow justify-between items-center px-2 py-3 cursor-pointer hover:bg-gray-200 rounded-md"
                onClick={() => onChangeCheckbox(todo.id, todo.isEdit)}
              >
                <div className="w-full flex gap-2 items-center">
                  {!todo.isEdit && (
                    <input
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      type="checkbox"
                      value={todo.content}
                      checked={todo.isCheck}
                      onChange={() => {}}
                    />
                  )}
                  <input
                    type="text"
                    id={String(todo.id)}
                    value={todo.content}
                    className="flex-grow min-w-[200px] font-semibold text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer"
                    readOnly={!todo.isEdit}
                    onChange={e => {
                      const id = e.target.id;
                      const value = e.target.value;

                      const deep = [...todoList].map(item => {
                        return String(item.id) === id
                          ? { ...item, content: value }
                          : item;
                      });
                      setTodoList(deep);
                    }}
                  />
                </div>
                {todo.isEdit ? (
                  <button
                    className={`flex w-[50px] gap-4 items-center text-sm text-blue-300 hover:font-semibold hover:text-blue-700`}
                    id={String(todo.id)}
                    value={todo.content}
                    onClick={e => {
                      const id = e.currentTarget.id;
                      const value = e.currentTarget.value;

                      const saveTodoList = [...todoList].map(item => {
                        return String(item.id) === id
                          ? { ...item, content: value, isEdit: false }
                          : item;
                      });
                      setTodoList(saveTodoList);
                    }}
                  >
                    완료
                  </button>
                ) : (
                  <button
                    className={`flex w-[50px] gap-4 items-center text-sm text-gray-300 hover:font-semibold hover:text-gray-700`}
                    onClick={e => {
                      onClickIsEdit(e, todo.id);
                    }}
                  >
                    편집
                  </button>
                )}
                <button
                  className="flex w-[50px] gap-4 items-center text-sm text-gray-300 hover:font-semibold hover:text-gray-700"
                  onClick={e => onClickDeleteTodo(e, todo.id)}
                >
                  삭제
                </button>
              </div>
            );
          })
        ) : filter.content && filterdTodoList.length > 0 ? ( // Filtered List
          filterdTodoList.map((todo: IStateTodo, i: number) => {
            return (
              <div
                key={i}
                className="flex flex-grow justify-between items-center px-2 py-3 cursor-pointer hover:bg-gray-200 rounded-md"
                onClick={() => onChangeCheckbox(todo.id, todo.isEdit)}
              >
                <div className="w-full flex gap-2 items-center">
                  <input
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    type="checkbox"
                    value={todo.content}
                    checked={todo.isCheck}
                  />
                  <input
                    type="text"
                    id={String(todo.id)}
                    value={todo.content}
                    className="flex-grow min-w-[200px] font-semibold text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer"
                    onChange={e => {
                      const id = e.target.id;
                      const value = e.target.value;

                      const deep = [...filterdTodoList].map(item => {
                        return String(item.id) === id
                          ? { ...item, content: value }
                          : item;
                      });
                      setFilterdTodoList(deep);
                    }}
                    readOnly={!todo.isEdit}
                  />
                </div>
                {todo.isEdit ? (
                  <button
                    className={`flex w-[50px] gap-4 items-center text-sm text-blue-300 hover:font-semibold hover:text-blue-700`}
                    id={String(todo.id)}
                    value={todo.content}
                    onClick={e => {
                      const id = e.currentTarget.id;
                      const value = e.currentTarget.value;

                      const saveTodoList = [...todoList].map(item => {
                        return String(item.id) === id
                          ? { ...item, content: value }
                          : item;
                      });

                      const filterdIsEditing = [...filterdTodoList].map(
                        item => {
                          return String(item.id) === id
                            ? { ...item, isEdit: false }
                            : item;
                        },
                      );
                      setFilterdTodoList(filterdIsEditing);
                      setTodoList(saveTodoList);
                    }}
                  >
                    완료
                  </button>
                ) : (
                  <button
                    className={`flex w-[50px] gap-4 items-center text-sm text-gray-300 hover:font-semibold hover:text-gray-700`}
                    onClick={e => onClickIsEdit(e, todo.id)}
                  >
                    편집
                  </button>
                )}
                <button
                  className="flex w-[50px] gap-4 items-center text-sm text-gray-300 hover:font-semibold hover:text-gray-700"
                  onClick={e => onClickDeleteTodo(e, todo.id)}
                >
                  삭제
                </button>
              </div>
            );
          })
        ) : (
          // Not Found
          <div className="m-3 font-semibold text-gray-300">
            할 일이 없습니다.
          </div>
        )}

        {/* Footer */}
        <div className="fixed border-t-[1px] border-gray-300 bottom-0 left-0 right-0">
          <input
            type="text"
            className="w-full px-4 py-4 focus:outline-none"
            placeholder="할 일을 입력해주세요."
            onChange={e => setInput(e.target.value)}
            value={input}
            onKeyPress={onKeyEnter}
          />
          <button
            type="button"
            className="absolute right-3 bottom-3 bg-blue-500 w-12 h-8 rounded-md text-white text-[14px] font-semibold hover:bg-blue-700 leading-3"
            onClick={onClickAddTodo}
          >
            추가
          </button>
        </div>
      </div>
    </>
  );
}
