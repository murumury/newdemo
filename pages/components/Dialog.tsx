// components/Dialog.js
export default function Dialog({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              {/* 你可以在这里添加对话框的图标 */}
            </div>
            <h3 className="text-lg leading-6 font-medium text-black">Dialog Title</h3>
            <textarea className="mt-2 px-7 py-3">
              {/* 对话框的内容 */
              }
              {children}
            </textarea>
            <text></text>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-green-500 text-black text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }