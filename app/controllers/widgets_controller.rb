require 'json'
class WidgetsController < ApplicationController

  # GET /widgets
  # GET /widgets.json
  def index
    @board = Board.find(params[:board_id])
    @widgets = @board.widgets

    render json: @widgets

    # respond_to do |format|
    #   format.html # index.html.erb
    #   format.json { render json: @widgets }
    # end
  end

  # GET /widgets/1
  # GET /widgets/1.json
  def show
    @widget = Board.find(params[:board_id]).widgets.where('_id' => Moped::BSON::ObjectId(params[:id])).first
    p @widget
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @widget }
    end
  end

  # GET /widgets/new
  # GET /widgets/new.json
  def new
    @widget = Widget.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @widget }
    end
  end

  # GET /widgets/1/edit
  def edit
    @widget = Widget.find(params[:id])
  end

  # POST /widgets
  # POST /widgets.json
  def create
    @widget = Widget.new(params[:widget])

    respond_to do |format|
      if @widget.save
        format.html { redirect_to @widget, notice: 'Widget was successfully created.' }
        format.json { render json: @widget, status: :created, location: @widget }
      else
        format.html { render action: "new" }
        format.json { render json: @widget.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /widgets/1
  # PUT /widgets/1.json
  def update
    @board = Board.find(params[:board_id])
    @widget = @board.widgets.where('_id' => Moped::BSON::ObjectId(params[:id])).first
    p @widget

    if params[:location] 
      @widget.location = params[:location]
    elsif params[:size]
      @widget.size = params[:size]
    elsif params[:"new-content"]
      p params["new-content"]
      @widget.params["content"] = params[:"new-content"]
      @widget.save

      render :json => params[:"new-content"]
      return
    end

    @widget.save

    p "in update"
    render :text => "yay"
    # respond_to do |format|
    #   if @widget.update_attributes(params[:widget])
    #     format.html { redirect_to @widget, notice: 'Widget was successfully updated.' }
    #     format.json { head :no_content }
    #   else
    #     format.html { render action: "edit" }
    #     format.json { render json: @widget.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /widgets/1
  # DELETE /widgets/1.json
  def destroy
    @widget = Widget.find(params[:id])
    @widget.destroy

    respond_to do |format|
      format.html { redirect_to widgets_url }
      format.json { head :no_content }
    end
  end
end
