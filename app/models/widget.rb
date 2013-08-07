class Widget
  include Mongoid::Document
  
  field :title, default: "No Title"
  field :location, type: Array, default: [0,0]
  field :params, type: Array, default: {}
  field :size, type: Array, default: [0,0]
  field :widgettype, default: "None"

  validates_presence_of :location, :size, :widgettype

  embedded_in :board, :inverse_of => :widgets

  attr_accessible :location, :size, :widgettype, :params, :title

end
