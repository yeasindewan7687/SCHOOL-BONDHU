import re

with open("src/pages/AdminPanel.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# I will find {activeResTab === 'links' && ( ... )} and remove it.
# Actually I can just replace the whole block if I find the exact substring or write a smart parser.

# Let's just remove everything from "{activeResTab === 'links' && (" up to the last "</div>\n      )}\n    </div>\n  )\n}"
start_str = "{activeResTab === 'links' && ("
end_str = "    </div>\n  )\n}\n\nexport function AdmissionsAdmin"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + "    </div>\n  )\n}\n\nexport function AdmissionsAdmin" + content[end_idx + len(end_str):]
    with open("src/pages/AdminPanel.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully removed links tab chunk.")
else:
    print("Could not find start or end index")
