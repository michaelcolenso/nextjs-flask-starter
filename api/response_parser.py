import re
def parse_golf_text(text):
    # Splitting the text by number followed by a period
    sections = re.split(r'\n\n(\d+)\. ', text)
    sections = sections[1:]  # The first element is empty or irrelevant

    parsed_data = {}
    for i in range(0, len(sections), 2):
        image_num = sections[i].strip()
        description = sections[i + 1].strip().split('\n\n')[0]  # Splitting in case overall feedback is in the same section
        parsed_data[f'image_{image_num}'] = description

    # Assuming the overall feedback is after the last image description
    overall_feedback = sections[-1].strip().split('\n\n')[-1]
    
    return parsed_data, overall_feedback


